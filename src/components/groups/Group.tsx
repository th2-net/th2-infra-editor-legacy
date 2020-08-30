/** ****************************************************************************
 * Copyright 2009-2020 Exactpro (Exactpro Systems Limited)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ***************************************************************************** */

import React, { RefObject } from 'react';
import Box, { BoxMethods } from './Box';
import { BoxEntity, BoxConnections, BoxEntityWrapper } from '../../models/Box';
import '../../styles/group.scss';

interface Props {
	title: string;
	boxes: Array<BoxEntity>;
	onParamBlur: (boxName: string, paramName: string, value: string) => void;
	addNewProp: (prop: {
		name: string;
		value: string;
	}, boxName: string) => void;
	addCoords: (box: BoxEntity, connections: BoxConnections) => void;
	connectableBoxes: BoxEntityWrapper[];
	setConnection: (box: BoxEntity) => void;
	changeCustomConfig: (config: {[prop: string]: string}, boxName: string) => void;
	deleteParam: (paramName: string, boxName: string) => void;
	setImageInfo: (imageProp: {
		name: 'image-name' | 'image-version' | 'node-port';
		value: string;
	}, boxName: string) => void;
	groupsTopOffset?: number;
	deleteBox: (boxName: string) => void;
}
const Group = ({
	title,
	boxes,
	onParamBlur,
	addNewProp,
	addCoords,
	connectableBoxes,
	setConnection,
	changeCustomConfig,
	deleteParam,
	setImageInfo,
	groupsTopOffset,
	deleteBox,
}: Props) => {
	const arrLength = boxes.length;
	const [boxRefs, setBoxRefs] = React.useState<React.RefObject<BoxMethods>[]>([]);
	const titleRef = React.useRef<HTMLHeadingElement>(null);

	React.useEffect(() => {
		setBoxRefs(boxRef => (
		  Array(arrLength).fill('').map((_, i) => boxRef[i] || React.createRef())
		));
	  }, [arrLength]);

	const onScroll = () => {
		boxRefs
			.filter(boxRef => boxRef.current?.kind === title)
			.forEach(boxRef => boxRef.current?.updateCoords());
	};

	return (
		<div className="group">
			<h1
				ref={titleRef}
				className="group__title">
				{title}
			</h1>
			<div className="group__items">
				<div
					onScroll={onScroll}
					className="group__items-scroller">
					{
						boxes.map((box, index) =>
							<Box
								key={`${box.name}-${index}`}
								box={box}
								ref={boxRefs[index]}
								onParamValueChange={onParamBlur}
								addNewProp={addNewProp}
								addCoords={addCoords}
								connectionDirection={connectableBoxes
									.find(wrapper => wrapper.box.name === box.name)?.connection}
								setConnection={setConnection}
								changeCustomConfig={changeCustomConfig}
								deleteParam={deleteParam}
								setImageInfo={setImageInfo}
								groupsTopOffset={groupsTopOffset}
								titleHeight={titleRef.current
									? (titleRef.current?.clientHeight
										+ parseInt(window.getComputedStyle(titleRef.current).marginBottom))
									: undefined}
								deleteBox={deleteBox}/>)
					}
				</div>
			</div>
		</div>
	);
};

export default Group;
