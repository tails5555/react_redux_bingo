import React, { Fragment } from 'react';

import './Complete.css';

// 가로선, 세로선, 대각선 별로 완료된 현황을 차례대로 출력했습니다.
// 선 별로 완료된 순서를 구현하는 방법이 떠오르지 않아 각 선 별 순서로 대체했습니다.
const Complete = ({ complete }) => (
    <Fragment>
        <ul className="list-group complete__container">
            <li className="list-group-item disabled">
                가로선 : { complete.horizontal.length === 0 ? '아직 없음' : complete.horizontal.join(', ') + ' 번째' }
            </li>
            <li className="list-group-item">
                세로선 : { complete.vertical.length === 0 ? '아직 없음' : complete.vertical.join(', ') + ' 번째' }
            </li>
            <li className="list-group-item">
                대각선 : { complete.cross.length === 0 ? '아직 없음' : complete.cross.join(', ') }
            </li>
        </ul>
    </Fragment>
);

export default Complete;