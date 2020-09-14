import React from 'react';
import {
    Button
} from 'antd';
import AvatarList from 'ant-design-pro/lib/AvatarList';

export default (props) => {
    return (
        <div>
            <div style={{width: '100%'}}>
                <AvatarList size="mini">
                    <AvatarList.Item
                        tips="Jake"
                        src="https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png"
                    />
                    <AvatarList.Item
                        tips="Andy"
                        src="https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png"
                    />
                    <AvatarList.Item
                        tips="Niko"
                        src="https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png"
                    />
                </AvatarList>,
            </div>
            <Button type='primary'>{props.content}</Button>
        </div>
        
    )
}