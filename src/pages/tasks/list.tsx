import { KanbanBoard, KanbanBoardContainer } from "@/components/tasks/kanban/board"
import KanbanColumn from "@/components/tasks/kanban/column"
import KanbanItem from "@/components/tasks/kanban/item"
import { TASKS_QUERY } from "@/graphql/queries"
import { TaskStage } from "@/graphql/schema.types"
import { useList } from "@refinedev/core"
import { useMemo } from "react"

export const TasksList = () => {
    const { data: stages, isLoading: isLoadingStages } = useList({
        resource: 'taskStages',
        filters: [
            {
                field: 'title',
                operator: 'in',
                value: ['TODO', 'IN PROGRESS', 'IN REVIEW', 'DONE']
            }
        ],
        sorters: [
            {
                field: 'title',
                order: 'asc'
            }
        ],
        meta: {
            gqlQuery: TASKS_QUERY
        }
    })

    const { data: tasks, isLoading: isLoadingTasks } = useList({
        resource: 'tasks',
        sorters: [
            {
                field: 'dueDate',
                order: 'asc',
            }
        ],
        queryOptions: {
            enabled: !!stages,
        },
        pagination: {
            mode: 'off'
        },
        meta: {
            gqlQuery: TASKS_QUERY
        }
    })

    const taskStages = useMemo(() => {
        if(!tasks?.data || !stages?.data) {
            return {
                unassignedStage: [],
                stages: []
            }
        }

        const unnassignedStage = tasks?.data.filter((task) => task?.stageId === null)

        const grouped: TaskStage[] = stages?.data.map((stage) => ({
            ...stage,
            tasks: tasks?.data.filter((task) => task?.stageId.toString() === stage?.id)
        }))
    }, [stages, tasks])

    return (
        <>
            <KanbanBoardContainer>
                <KanbanBoard>
                    <KanbanColumn>
                        <KanbanItem>

                        </KanbanItem>
                    </KanbanColumn> 
                    <KanbanColumn>

                    </KanbanColumn> 
                </KanbanBoard>
            </KanbanBoardContainer>
        </>
    )
}