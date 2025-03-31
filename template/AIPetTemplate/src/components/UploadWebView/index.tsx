/* eslint-disable no-console */
/* eslint-disable react/sort-comp */
import { View, WebView, createWebviewContext } from '@ray-js/ray';
import createInvoke from '@ray-js/webview-invoke/native';
import React, { Component } from 'react';

import store from '@/redux';
import { initData, unmountData } from '@/redux/modules/uploadFileSlice';
import { UploadViewProps } from './types';
import { UPLOAD_COMPONENT_ID } from './utils';

const info = `%c 【Upload WebView】 Log: Loaded Success`;
const theme = `background: #00cca3; color: #FFFFFF; font-size: 14px`;

class UploadWebView extends Component<UploadViewProps> {
  webviewId: string;
  webviewContext: any;
  invoke: any;
  componentId: string;
  count: number;
  errorCount: number;
  invokeStatus: boolean;
  uploadState: boolean;

  constructor(props: UploadViewProps) {
    super(props);
    this.webviewId = `webviewId_${new Date().getTime()}`;
    this.componentId = `${props.componentId || UPLOAD_COMPONENT_ID}`;
    this.count = 0;
    this.errorCount = 0;
    this.invokeStatus = false;

    this.createUploadState = this.createUploadState.bind(this);
  }

  bindInvoke = () => {
    this.props.onPageLoadEnd &&
      this.invoke.define(
        'onPageLoadEnd',
        this.props.onPageLoadEnd
          ? this.props.onPageLoadEnd
          : data => {
              console.log('onPageLoadEnd', data);
            }
      );

    this.props.onLoggerInfo &&
      this.invoke.define('onLoggerInfo', (params: { info: string; theme: string; args: any }) => {
        this.props.onLoggerInfo(params);
      });

    this.invokeStatus = true;
  };

  bindWebViewInvoke() {
    if (createWebviewContext) {
      this.webviewContext = createWebviewContext(this.webviewId);
      Object.defineProperty(this.webviewContext, 'platform', {
        value: 'mini',
        writable: false,
      });

      this.invoke = createInvoke(() => this.webviewContext);
    }
  }

  /**
   * 当进程崩溃时, 重新恢复
   */
  reload() {
    if (this.webviewContext) {
      if (typeof this.webviewContext.reload === 'function') {
        this.webviewContext.reload({});
      }
    }
  }

  onRenderProcessGone(data) {
    console.error('onRenderProcessGone ==>', data);
    this.reload();
  }

  // 这里接受来自WebView的消息
  onMessage = evt => {
    console.log('WebView onMessage ==>', evt);
    if (this.invoke) {
      this.invoke.listener(evt);
    }
  };

  /**
   * 更改状态
   */
  createUploadState() {
    // 将该组件存入 redux 中
    store.dispatch(
      initData({
        componentId: this.componentId,
        instanceType: 'webview',
        invoke: this.invoke,
        createUploadState: this.createUploadState,
      })
    );
  }

  /**
   * 清空WebView的相关引用
   */
  clearUploadView() {
    store.dispatch(unmountData({ componentId: this.componentId }));
  }

  async componentDidMount() {
    this.bindWebViewInvoke();
    this.bindInvoke();
  }

  componentDidUpdate() {
    this.createUploadState();
  }

  componentWillUnmount() {
    this.clearUploadView();
  }

  render() {
    return (
      <View style={{ display: 'relative', width: 0, height: 0 }}>
        <WebView
          src="webview://webview/index.html"
          id={this.webviewId}
          // @ts-ignore
          onRenderProcessGone={this.onRenderProcessGone}
          onMessage={this.onMessage}
          onLoad={() => {
            this.errorCount = 0;
            this.props.onLoggerInfo &&
              this.props.onLoggerInfo({
                info,
                theme,
                args: {
                  componentId: this.componentId,
                },
              });
            // 初始化 配置
            this.createUploadState();
          }}
          onError={event => {
            console.warn(`【Upload WebView】${this.componentId} WebView onError`, event);
            if (this.errorCount <= 5) {
              this.webviewId = `webviewId_${new Date().getTime()}`;
              this.reload();
              this.createUploadState();
              this.errorCount++;
            }
          }}
        />
      </View>
    );
  }
}

export default UploadWebView;
