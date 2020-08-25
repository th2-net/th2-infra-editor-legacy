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

import React, { useImperativeHandle } from 'react';
import { observer } from 'mobx-react-lite';
import { createBemElement } from '../../helpers/styleCreators';
import { BoxEntity, BoxConnections } from '../../models/Box';
import '../../styles/box.scss';
import useStore from '../../hooks/useStore';
import { ModalPortal } from '../Portal';
import BoxModal from './BoxModal';
import useWindowSize from '../../hooks/useWindowSize';

interface Props {
	box: BoxEntity;
	onParamValueChange: (boxName: string, paramName: string, value: string) => void;
	addNewProp: (prop: {
		name: string;
		value: string;
	}, boxName: string) => void;
	addCoords: (box: BoxEntity, connections: BoxConnections) => void;
	connectionDirection?: string;
	setConnection: (box: BoxEntity) => void;
	changeCustomConfig: (config: {[prop: string]: string}, boxName: string) => void;
	deleteParam: (paramName: string, boxName: string) => void;
}

export interface BoxMethods {
	updateCoords: () => void;
	kind: string;
}

const Box = ({
	box,
	onParamValueChange,
	addNewProp,
	addCoords,
	connectionDirection,
	setConnection,
	changeCustomConfig,
	deleteParam,
}: Props, ref: React.Ref<BoxMethods>) => {
	const { rootStore } = useStore();
	const [isModalOpen, setIsModalOpen] = React.useState(false);

	const boxRef = React.useRef<HTMLDivElement>(null);

	const windowSize = useWindowSize();

	React.useEffect(() => {
		sendCoords();
	}, [windowSize]);

	useImperativeHandle(
		ref,
		() => ({
			updateCoords: () => {
				sendCoords();
			},
			kind: box.kind,
		}), [],
	);

	const sendCoords = () => {
		const clientRect = boxRef.current?.getBoundingClientRect();
		if (clientRect) {
			const leftConnection = {
				left: clientRect?.left,
				top: clientRect?.top + (clientRect?.height / 2),
			};
			const rightConnection = {
				left: clientRect?.left + clientRect.width,
				top: clientRect?.top + (clientRect?.height / 2),
			};
			addCoords(box, {
				leftConnection,
				rightConnection,
			});
		}
	};

	const settingsIconClassName = createBemElement(
		'box',
		'settings-icon',
		isModalOpen ? 'active' : null,
	);

	return (
		<>
			<div
				ref={boxRef}
				className="box"
				onClick={() => {
					if (!rootStore.selectedBox) {
						rootStore.setSelectedBox(box);
					} else {
						rootStore.setSelectedBox(null);
					}
				}}>
				<div className="box__header">
					<span className="box__title">
						{box.name}
					</span>
					<button
						className="box__settings-button"
						onClick={e => {
							e.stopPropagation();
							setIsModalOpen(!isModalOpen);
						}}>
						<i className={settingsIconClassName}/>
					</button>
					{
						connectionDirection === 'left'
							? (
								<div
									className="box__connection left"
									onClick={e => {
										e.stopPropagation();
										setConnection(box);
									}}
								></div>
							) : connectionDirection === 'right' ? (
								<div
									className="box__connection right"
									onClick={e => {
										e.stopPropagation();
										setConnection(box);
									}}
								></div>
							) : null
					}
				</div>
			</div>
			<ModalPortal isOpen={isModalOpen}>
				<BoxModal
					box={box}
					onParamValueChange={onParamValueChange}
					onClose={() => setIsModalOpen(false)}
					addNewProp={addNewProp}
					changeCustomConfig={changeCustomConfig}
					deleteParam={deleteParam}
				/>
			</ModalPortal>
		</>
	);
};

export default observer(Box, { forwardRef: true });
