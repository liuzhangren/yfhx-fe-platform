import React from 'react';
import style from './welcome.less';

export default () => {
    // console.log(style)
    return (
        <div className={style.container}>
            <h1 className={style.title}>Hello, Welcome to StoryBook!!!</h1>
        </div>
    )
}