import { getNameInitials } from "@/utilities";
import { Avatar as AntdAvatar, AvatarProps } from "antd";

type Props = AvatarProps & {
    name?: string;
}

const CustomAvatar = ({ name, style, ...rest }: Props) => {
  return (
    <AntdAvatar
        alt={'Patrick NAMEGNI'}
        size="small"
        style={{
            backgroundColor: '#87d068',
            display: 'flex',
            alignItems: 'center',
            border: 'none',
            ...style
        }}
        {...rest}
    >
        {getNameInitials(name || 'JS')}
    </AntdAvatar>
  )
}

export default CustomAvatar