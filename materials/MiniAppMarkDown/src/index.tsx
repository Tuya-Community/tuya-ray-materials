import React from 'react';
import { withReactProps } from './withReactProps';
import { IProps } from './props';

const Markdown = withReactProps<IProps>();

export default Markdown as React.FC<IProps>;
