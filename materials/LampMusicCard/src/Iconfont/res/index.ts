import { encodeSvg } from '../../utils';

const preStr = '';
const triangleClose = `${preStr}<svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 0C0.671573 0 0 0.671573 0 1.5V12.5C0 13.3284 0.671573 14 1.5 14C2.32843 14 3 13.3284 3 12.5V1.5C3 0.671573 2.32843 0 1.5 0ZM8.5 0C7.67157 0 7 0.671573 7 1.5V12.5C7 13.3284 7.67157 14 8.5 14C9.32843 14 10 13.3284 10 12.5V1.5C10 0.671573 9.32843 0 8.5 0Z" fill="#1082FE"/></svg>`;
const triangleOpen = `${preStr}<svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.383 6.31764C12.6076 7.10492 12.6076 8.89508 11.383 9.68236L3.08152 15.019C1.75049 15.8747 0 14.919 0 13.3367L0 2.66333C0 1.081 1.75049 0.125316 3.08152 0.980974L11.383 6.31764Z" fill="#1082FE"/></svg>`;

export default { triangleOpen: encodeSvg(triangleOpen), triangleClose: encodeSvg(triangleClose) };
