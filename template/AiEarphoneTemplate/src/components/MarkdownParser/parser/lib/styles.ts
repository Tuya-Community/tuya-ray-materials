// import { Platform } from 'react-native';

// this is converted to a stylesheet internally at run time with StyleSheet.create(
export const styles = {
  // The main container
  body: {},

  // Headings
  heading1: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  heading2: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  heading3: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  heading4: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  heading5: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  heading6: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },

  // Horizontal Rule
  hr: {
    backgroundColor: '#000000',
    height: '1px',
  },

  // Emphasis
  strong: {
    fontWeight: 'bold',
    // marginBottom: '16px',
    marginRight: '4px',
    marginLeft: '4px',
  },
  em: {
    fontStyle: 'italic',
  },
  s: {
    textDecorationLine: 'line-through',
  },

  // Blockquotes
  blockquote: {
    backgroundColor: '#F5F5F5',
    borderColor: '#CCC',
    borderLeftWidth: '4px',
    marginLeft: '5px',
    paddingHorizontal: '5px',
  },

  // Lists
  bullet_list: {
    marginBottom: '12px',
  },
  ordered_list: {},
  list_item: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  // @pseudo class, does not have a unique render rule
  bullet_list_icon: {
    marginLeft: '10px',
    marginRight: '10px',
  },
  // @pseudo class, does not have a unique render rule
  bullet_list_content: {
    flex: 1,
  },
  // @pseudo class, does not have a unique render rule
  ordered_list_icon: {
    marginLeft: '10px',
    marginRight: '10px',
  },
  // @pseudo class, does not have a unique render rule
  ordered_list_content: {
    flex: 1,
  },

  // Code
  code_inline: {
    borderWidth: '1px',
    borderColor: '#CCCCCC',
    backgroundColor: '#f5f5f5',
    padding: '10px',
    borderRadius: '4px',
    // ...Platform.select({
    //   ['ios']: {
    //     fontFamily: 'Courier',
    //   },
    //   ['android']: {
    //     fontFamily: 'monospace',
    //   },
    // }),
  },
  code_block: {
    borderWidth: '1px',
    borderColor: '#CCCCCC',
    backgroundColor: '#f5f5f5',
    padding: '10px',
    borderRadius: '4px',
    // ...Platform.select({
    //   ['ios']: {
    //     fontFamily: 'Courier',
    //   },
    //   ['android']: {
    //     fontFamily: 'monospace',
    //   },
    // }),
  },
  fence: {
    borderWidth: '1px',
    borderColor: '#CCCCCC',
    backgroundColor: '#f5f5f5',
    padding: '10px',
    borderRadius: '4px',
    // ...Platform.select({
    //   ['ios']: {
    //     fontFamily: 'Courier',
    //   },
    //   ['android']: {
    //     fontFamily: 'monospace',
    //   },
    // }),
  },

  // Tables
  table: {
    borderWidth: '1px',
    borderColor: '#000000',
    borderRadius: '3px',
  },
  thead: {},
  tbody: {},
  th: {
    flex: 1,
    padding: '5px',
  },
  tr: {
    display: 'flex',
    borderBottomWidth: '1px',
    borderColor: '#000000',
    flexDirection: 'row',
  },
  td: {
    flex: 1,
    padding: '5px',
  },

  // Links
  link: {
    textDecorationLine: 'underline',
  },
  blocklink: {
    flex: 1,
    borderColor: '#000000',
    borderBottomWidth: '1px',
  },

  // Images
  image: {
    flex: 1,
  },

  // Text Output
  text: {},
  textgroup: {},
  paragraph: {
    display: 'flex',
    marginTop: '10px',
    marginBottom: '10px',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
  },
  hardbreak: {
    width: '100%',
    height: '1px',
  },
  softbreak: {},

  // Believe these are never used but retained for completeness
  pre: {},
  inline: {},
  span: {},
};
