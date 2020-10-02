/** *****************************************************************************
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

import React from 'react';
import { observer } from 'mobx-react-lite';
import { diff } from 'deep-object-diff';
import '../../styles/history.scss';
import useHistoryStore from '../../hooks/useHistoryStore';
import { Change, Snapshot } from '../../models/History';
import { isBoxEntity } from '../../models/Box';
import { useKeyPress } from '../../hooks/useKeyPress';
import { createBemBlock } from '../../helpers/styleCreators';
import { isLink } from '../../models/LinksDefinition';
import { isDictionaryEntity } from '../../models/Dictionary';

interface HistoryItemProps {
	snapshot: Snapshot;
	isLastAppiled: boolean;
}

const HistoryItem = ({
	snapshot,
	isLastAppiled,
}: HistoryItemProps) => {
	const getSnapshotTitle = (change: Change) => {
		if (!change.from) {
			const titlePart = `"${change.object}" was added`;
			if (isBoxEntity(change.to)) {
				return `Resource ${titlePart}`;
			}
			if (isLink(change.to)) {
				return `Connection ${titlePart}`;
			}
			return `Dictionary ${titlePart}`;
		}
		if (!change.to) {
			const titlePart = `"${change.object}" was deleted`;
			if (isBoxEntity(change.from)) {
				return `Resource ${titlePart}`;
			}
			if (isLink(change.from)) {
				return `Connection ${titlePart}`;
			}
			return `Dictionary ${titlePart}`;
		}
		if (isDictionaryEntity(change.from)) {
			return `Dictionary "${change.object}" was changed`;
		}
		return `${isBoxEntity(change.from)
			? 'Resource' : 'Connection'} "${change.object}"`;
	};

	return (
		<div
			className={
				createBemBlock(
					'history-item',
					isLastAppiled ? 'applied' : null,
				)
			}>
			{
				snapshot.changeList.map((change, index) => (
					<React.Fragment key={`${change.object}${index}}`}>
						<h3
							style={{
								borderBottom: (change.from || change.to) ? 'none' : '1px solid #00997F',
							}}
							className="history-item-object">
							{getSnapshotTitle(change)}
						</h3>
						{change.from && change.to && !isDictionaryEntity(change.from) && (
							<div className="history-item-change">
								<div className="history-item-change-state">
									<span className="history-item-change-key">From:</span>
									<pre className="history-item-change-value">
										{JSON.stringify(diff(change.to, change.from), null, 4)}
									</pre>
								</div>
								<div className="history-item-change-state">
									<span className="history-item-change-key">To:</span>
									<pre className="history-item-change-value">
										{JSON.stringify(diff(change.from, change.to), null, 4)}
									</pre>
								</div>
							</div>
						)}
					</React.Fragment>
				))
			}
		</div>
	);
};

const HistoryView = () => {
	const historyStore = useHistoryStore();

	const isCtrlKeyPressed = useKeyPress('Control');
	const isZKeyPressed = useKeyPress('z');
	const isYKeyPressed = useKeyPress('y');

	React.useEffect(() => {
		if (isCtrlKeyPressed) {
			if (isZKeyPressed) {
				historyStore.toPreviousSnapshot();
			}
			if (isYKeyPressed) {
				historyStore.toNextSnapshot();
			}
		}
	}, [isCtrlKeyPressed, isZKeyPressed, isYKeyPressed]);

	return (
		<div className="history-view">
			{
				historyStore.history.length > 0
					? <>
						<div className="history-view__controls">
							<button
								onClick={historyStore.toPreviousSnapshot}
								className="history-view__control-button">
								Previous
							</button>
							<button
								onClick={historyStore.toNextSnapshot}
								className="history-view__control-button">
								Next
							</button>
						</div>
						<div
							style={{
								height: `${window.innerHeight - 43}px`,
							}}
							className="history-list">
							{
								historyStore.history.map((snapshot: Snapshot, index) => (
									<HistoryItem
										key={index}
										snapshot={snapshot}
										isLastAppiled={snapshot === historyStore.lastAppliedSnapshot} />
								))
							}
						</div>
					</>
					: <h3 className="history-list__title">History list is empty</h3>
			}
		</div>
	);
};

export default observer(HistoryView);
