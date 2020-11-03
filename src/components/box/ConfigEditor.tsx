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

import React from 'react';
import { createBemBlock } from '../../helpers/styleCreators';
import { InputConfig } from '../../hooks/useInput';

interface ConfigEditor {
	configInput: InputConfig;
}

const ConfigEditor = ({ configInput }: ConfigEditor) => {
	const textAreaClass = createBemBlock('textarea', !configInput.isValid ? 'invalid' : null);

	return (
		<div className='textarea-wrapper'>
			<label htmlFor={configInput.bind.name} className='textarea-label'>
				{configInput.label}
			</label>
			<textarea className={textAreaClass} {...configInput.bind} />
		</div>
	);
};

export default ConfigEditor;
