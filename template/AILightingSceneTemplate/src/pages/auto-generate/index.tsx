import React, { useEffect, useState, useRef } from 'react';
import { View, Image, showToast, showLoading, hideLoading, exitMiniProgram } from '@ray-js/ray';
import { NavBar } from '@ray-js/smart-ui';
import clsx from 'clsx';
import { getLightAppAiRuleNames, previewLightScene, saveLightScene } from '@tuya-miniapp/cloud-api';
import { predictLightScenes, getRoomList } from '@/apis/nativeApi';
import { getAppHomeId, getAppHomeInfo } from '@/utils/getAppHomeId';
import { getRandom9Objects } from '@/utils';
import { colors } from '@/constant';
import {
  xingIcon,
  selectIcon,
  unSelectIcon,
  replaceIcon,
  loadingIcon,
  gouIcon,
  tickIcon,
  emptyIcon,
} from '@/imgs';
import styles from './index.module.less';

export default function AutoGenerate(props) {
  const [sceneList, setSceneList] = useState([]);
  const [curList, setCurList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [loadingItems, setLoadingItems] = useState(new Set());
  const [successItems, setSuccessItems] = useState(new Set());
  const [isRefreshingAll, setIsRefreshingAll] = useState(false);
  const [isInit, setIsInit] = useState(false);
  const [refreshAllCount, setRefreshAllCount] = useState(0);

  const propsRef = useRef({ ...props.location.query });

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    const homeId = await getAppHomeId();
    // 兼容没有传 roomId 和 sceneType 的情况
    const currentProps = { ...props.location.query };
    currentProps.sceneType =
      typeof props.location.query.sceneType === 'undefined' ? 3 : props.location.query.sceneType;
    if (!props.location.query.roomId) {
      const { roomDatas = [] } = await getRoomList({
        ownerId: homeId,
      });
      // const randomIndex = Math.floor(Math.random() * roomDatas.length);
      const randomIndex = 0; // 先默认取第一个房间
      currentProps.roomId = roomDatas[randomIndex]?.roomId;
    } else {
      currentProps.roomId = props.location.query.roomId;
    }
    propsRef.current = currentProps;

    const { roomId, sceneType } = propsRef.current;
    console.log('initData----', { homeId, roomId, sceneType });
    const allList = await getLightAppAiRuleNames({ ownerId: homeId, roomId, sceneType });
    const allSceneList =
      allList.length > 0
        ? allList.map((item, index) => {
            return { id: index, ...item };
          })
        : [];
    setSceneList(allSceneList);
    if (allSceneList.length === 0) {
      setIsInit(true);
      return;
    }
    const list = getRandom9Objects(allSceneList);
    console.log('sceneDataList', roomId, homeId, allSceneList, list);
    // 生成灯光场景预测数据
    predictLightScenes({
      roomId,
      generateSceneStyles: list,
      sceneType,
    })
      .then(res => {
        const newList = list.map(item => {
          const matched = res?.find(i => i.name === item.name);
          return matched ? { ...item, lightSceneInfo: matched } : item;
        });
        setCurList(newList);
        setIsInit(true);
      })
      .catch(err => {
        showToast({ title: I18n.t('generate_failed'), icon: 'none' });
      });
  };

  const selectAll = () => {
    if (curList.length === 0) return;
    if (selectedList.length === curList.length) {
      setSelectedList([]);
    } else {
      const { isDistributed, sceneNum } = props.location.query;
      if (isDistributed && curList.length + Number(sceneNum) > 20) {
        showToast({ title: I18n.t('select_limit_tip'), icon: 'none' });
        return;
      }
      setSelectedList([...curList]);
    }
  };

  const select = item => {
    const isSelected = selectedList.some(i => i.id === item.id);
    if (isSelected) {
      setSelectedList(selectedList.filter(i => i.id !== item.id));
    } else {
      const { isDistributed, sceneNum } = props.location.query;
      if (isDistributed && selectedList.length + Number(sceneNum) >= 20) {
        showToast({ title: I18n.t('select_limit_tip'), icon: 'none' });
        return;
      }
      setSelectedList([...selectedList, item]);
    }
  };

  const refreshAll = () => {
    if (!isInit) return;
    if (selectedList.length > 0 && selectedList.length === curList.length) {
      showToast({ title: I18n.t('refresh_tip'), icon: 'none' });
      return;
    }

    // 检查是否需要显示灵感枯竭提示
    if (sceneList.length > 9 && sceneList.length <= 25) {
      const newCount = refreshAllCount + 1;
      setRefreshAllCount(newCount);

      if (newCount >= 3) {
        showToast({ title: I18n.t('soDifficult'), icon: 'none' });
      }
    }

    // 随机更换所有场景, 如果已有选中的则不更换, 只更换未选中的
    setIsRefreshingAll(true);

    const newCurList = [...curList];
    const unselectedIndices = [];

    // 找出未选中的场景索引
    curList.forEach((item, index) => {
      const isSelected = selectedList.some(i => i.id === item.id);
      if (!isSelected) {
        unselectedIndices.push(index);
        // 为未选中的场景添加加载状态
        setLoadingItems(prev => new Set([...prev, item.id]));
      }
    });

    // 执行替换
    setTimeout(() => {
      // 获取当前未使用的场景（排除当前列表中已存在的场景）
      const availableScenes = sceneList.filter(
        scene => !selectedList.some(currentScene => currentScene.id === scene.id)
      );

      const newSceneIds = [];
      // 为每个未选中的位置随机分配新场景
      unselectedIndices.forEach(index => {
        if (availableScenes.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableScenes.length);
          const randomScene = availableScenes.splice(randomIndex, 1)[0];
          newCurList[index] = randomScene;
          newSceneIds.push(randomScene.id);
        }
      });
      const { roomId, sceneType } = propsRef.current;
      // 生成灯光场景预测数据
      predictLightScenes({
        roomId,
        generateSceneStyles: newCurList,
        sceneType,
      })
        .then(res => {
          const newList = newCurList.map(item => {
            const matched = res?.find(i => i.name === item.name);
            return matched ? { ...item, lightSceneInfo: matched } : item;
          });
          setCurList(newList);
          setIsRefreshingAll(false);
          setLoadingItems(new Set()); // 清空所有加载状态

          // 为新场景添加成功状态
          setSuccessItems(prev => new Set([...prev, ...newSceneIds]));

          // 1.5秒后移除成功状态
          setTimeout(() => {
            setSuccessItems(prev => {
              const newSet = new Set(prev);
              newSceneIds.forEach(id => newSet.delete(id));
              return newSet;
            });
          }, 1000);
        })
        .catch(err => {
          showToast({ title: I18n.t('execut_error'), icon: 'none' });
          setIsRefreshingAll(false);
          setLoadingItems(new Set()); // 清空所有加载状态
        });
    }, 300);
  };

  const refresh = (item, index) => {
    console.log('Refresh item', item, index);

    // 添加加载状态
    setLoadingItems(prev => new Set([...prev, item.id]));

    // 更换场景并移除加载状态
    setTimeout(() => {
      // 随机更换单个场景颜色
      const color = colors[Math.floor(Math.random() * colors.length)];
      const newItem = { ...item, color };
      // 生成灯光场景预测数据
      // const { roomId = '', sceneType } = props.location.query;
      const { roomId, sceneType } = propsRef.current;
      predictLightScenes({
        roomId,
        generateSceneStyles: [newItem],
        sceneType,
      })
        .then(res => {
          const newCurList = [...curList];
          newCurList[index] = { ...newItem, lightSceneInfo: res[0] };
          setCurList(newCurList);

          // 移除加载状态，添加成功状态
          setLoadingItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(newItem.id);
            return newSet;
          });

          setSuccessItems(prev => new Set([...prev, newItem.id]));

          // 1.5秒后移除成功状态
          setTimeout(() => {
            setSuccessItems(prev => {
              const newSet = new Set(prev);
              newSet.delete(newItem.id);
              return newSet;
            });
          }, 1000);
          // 预览新场景
          preview(newCurList[index]);
        })
        .catch(err => {
          showToast({ title: I18n.t('execut_error'), icon: 'none' });
          setIsRefreshingAll(false);
          setLoadingItems(new Set()); // 清空所有加载状态
        });
    }, 300);
  };

  const preview = async item => {
    const { roomId } = propsRef.current;
    const homeId = await getAppHomeId();
    const params = {
      actions: item.lightSceneInfo?.actions || [],
      parentRegionId: roomId,
      originPercent: 0,
      targetPercent: 0,
      type: 2,
    };
    console.log('Preview item', item, params);
    previewLightScene({
      previewExpr: JSON.stringify(params),
      ownerId: homeId,
    })
      .then(res => {
        console.log('Preview success', res);
      })
      .catch(err => {
        console.error('Preview error', err);
        showToast({ title: I18n.t('execut_error'), icon: 'none' });
      });
  };

  const save = async () => {
    const homeInfo = await getAppHomeInfo();
    console.log('Save button clicked', props.location.query, selectedList, homeInfo);
    if (!homeInfo?.admin) {
      showToast({ title: I18n.t('no_admin_permission'), icon: 'none' });
      return;
    }
    showLoading({ title: I18n.t('loading'), mask: true });
    const { roomId, sceneType } = propsRef.current;

    try {
      const homeId = await getAppHomeId();
      // 创建所有保存任务的Promise数组
      const savePromises = selectedList.map(item =>
        saveLightScene({
          sceneExpr: JSON.stringify({
            actions: item.lightSceneInfo?.actions || [],
            parentRegionId: roomId,
            name: item.name,
            displayColor: item.color,
            sceneType: Number(sceneType),
            matchType: 1,
            icon: item.icon,
          }),
          ownerId: homeId,
        })
          .then(res => {
            console.log('Save success for item', item, res);
            return { success: true, item, result: res };
          })
          .catch(err => {
            console.error('Save error for item', item, err);
            return { success: false, item, error: err };
          })
      );

      // 等待所有保存操作完成
      const results = await Promise.all(savePromises);

      // 统计成功和失败的数量
      const successCount = results.filter(r => r.success).length;
      const failureCount = results.filter(r => !r.success).length;

      hideLoading();

      if (failureCount === 0) {
        // 全部成功
        showToast({
          title: I18n.t('save_all_success'),
          icon: 'success',
        });
        setTimeout(() => {
          exitMiniProgram({});
        }, 1000);
      } else if (successCount === 0) {
        // 全部失败
        showToast({
          title: I18n.t('execut_error'),
          icon: 'none',
        });
      } else {
        // 部分成功
        showToast({
          title: I18n.t('save_all_success'),
          // title: I18n.t('save_partial_success'),
          icon: 'none',
        });
        setTimeout(() => {
          exitMiniProgram({});
        }, 1000);
      }
    } catch (error) {
      hideLoading();
      // showToast({ title: I18n.t('execut_error'), icon: 'none' });
      console.log('save operation failed', error);
    }
  };

  const handleJumpToManualCreat = () => {
    // const { roomId = '', sceneType } = props.location.query;
    const { roomId, sceneType } = propsRef.current;
    const url = `thing_light_scene_setting_url?roomId=${roomId}&sceneType=${sceneType}`;
    ty.router({
      url,
      success: () => {
        console.log('ty.router success', url);
      },
      fail: error => {
        console.error('ty.router fail', url, error);
      },
    });
  };

  const handleBack = () => {
    exitMiniProgram({});
  };

  return (
    <View className={styles.pageWrapper}>
      <NavBar
        leftArrow={false}
        onClickLeft={handleBack}
        border={false}
        customStyle={
          {
            '--nav-bar-background-color': 'transparent',
            '--nav-bar-arrow-color': '#FFFFFF',
          } as Record<string, string>
        }
      />
      <View className={styles.pageContainer}>
        <View className={styles.title}>{I18n.t('auto_generate')}</View>
        <View className={styles.desc}>{I18n.t('auto_desc')}</View>
        <View className={styles.main}>
          {!isInit && (
            <View className={clsx(styles.skeletonList, { [styles.skeletonMain]: !isInit })}>
              {new Array(9).fill(0).map((_, index) => {
                return <View className={styles.skeletonItem} key={index}></View>;
              })}
            </View>
          )}
          {isInit && !sceneList.length && (
            <View className={styles.empty}>
              <Image className={styles.emptyIcon} src={emptyIcon} />
              <View className={styles.emptyText}>{I18n.t('needToStudy')}</View>
            </View>
          )}
          {isInit && (
            <View className={styles.sceneList}>
              {curList.map((item, index) => {
                const isSelected = selectedList.some(i => i.id === item.id);
                const isLoading = loadingItems.has(item.id);
                const isSuccess = successItems.has(item.id);
                const hasLoading = loadingItems.size > 0 || successItems.size > 0;
                return (
                  <View className={styles.sceneItem} key={item.id}>
                    <View
                      className={clsx(styles.content, {
                        [styles.canActive]: !hasLoading && !isSelected,
                      })}
                      style={{
                        backgroundColor: `#${item.color}`,
                        opacity: isSelected ? 0.4 : 1,
                      }}
                      onClick={e => {
                        e.origin.stopPropagation();
                        if (isSelected) return;
                        if (hasLoading) {
                          showToast({
                            title: I18n.t('disabled_refresh_tip'),
                            icon: 'none',
                          });
                          return;
                        }
                        preview(item);
                      }}
                    ></View>
                    {sceneList.length > 9 && (
                      <View
                        className={styles.refreshIconWrapper}
                        onClick={e => {
                          e.origin.stopPropagation();
                          if (isSelected) return;
                          if (hasLoading) {
                            showToast({
                              title: I18n.t('disabled_action_tip'),
                              icon: 'none',
                            });
                            return;
                          }
                          refresh(item, index);
                        }}
                      >
                        <View className={styles.loadingWrapper}>
                          <Image
                            className={clsx(styles.loadingIcon, {
                              [styles.rotating]: isLoading || (isRefreshingAll && !isSelected),
                              [styles.hidden]: isSuccess,
                            })}
                            src={loadingIcon}
                          />
                          <Image
                            className={clsx(styles.tickIcon, {
                              [styles.visible]: isSuccess,
                            })}
                            src={tickIcon}
                          />
                        </View>
                      </View>
                    )}
                    <View
                      className={styles.selectIconBox}
                      onClick={e => {
                        e.origin.stopPropagation();
                        if (hasLoading) {
                          showToast({
                            title: I18n.t('disabled_action_tip'),
                            icon: 'none',
                          });
                          return;
                        }
                        select(item);
                      }}
                    >
                      <View className={styles.selectIconWrapper}>
                        {isSelected ? (
                          <View
                            className={styles.selectBox}
                            style={{ backgroundColor: `#${item.color}` }}
                          >
                            <Image className={styles.gouIcon} src={gouIcon} />
                          </View>
                        ) : (
                          <View className={styles.unSelectBox}></View>
                        )}
                      </View>
                    </View>
                    <View className={styles.name}>{item.name}</View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {!isInit || (isInit && sceneList.length) ? (
          <View className={styles.actionBar}>
            <View
              className={clsx(styles.selectAll, {
                [styles.btn_disabled_event_none]: sceneList.length === 0 || curList.length === 0,
              })}
              onClick={() => {
                if (loadingItems.size > 0 || successItems.size > 0) {
                  showToast({
                    title: I18n.t('disabled_action_tip'),
                    icon: 'none',
                  });
                  return;
                }
                selectAll();
              }}
            >
              <Image
                className={styles.icon}
                src={selectedList.length < curList.length ? selectIcon : unSelectIcon}
              />
              {selectedList.length < curList.length ? I18n.t('selectAll') : I18n.t('deselectAll')}
            </View>
            {!(isInit && sceneList.length <= 9) && (
              <View
                className={clsx(styles.refresh, {
                  [styles.btn_disabled]:
                    sceneList.length === 0 || selectedList.length === curList.length,
                })}
                onClick={() => {
                  if (loadingItems.size > 0 || successItems.size > 0) {
                    showToast({
                      title: I18n.t('disabled_action_tip'),
                      icon: 'none',
                    });
                    return;
                  }
                  refreshAll();
                }}
              >
                <Image
                  className={clsx(styles.icon, { [styles.rotating]: isRefreshingAll })}
                  src={replaceIcon}
                />
                {I18n.t('changeABatch')}
              </View>
            )}
          </View>
        ) : null}
      </View>
      <View className={styles.footer}>
        {!isInit || (isInit && sceneList.length) ? (
          <View
            className={clsx(styles.btn, {
              [styles.btn_disabled_event_none]: selectedList.length === 0,
            })}
            onClick={() => {
              if (loadingItems.size > 0 || successItems.size > 0) {
                showToast({
                  title: I18n.t('disabled_action_tip'),
                  icon: 'none',
                });
                return;
              }
              save();
            }}
          >
            <Image className={styles.icon} src={xingIcon} />
            {I18n.t('generateScenario')}
          </View>
        ) : (
          <View className={styles.btn} onClick={handleJumpToManualCreat}>
            <Image className={styles.icon} src={xingIcon} />
            {I18n.t('manualCreation')}
          </View>
        )}
      </View>
    </View>
  );
}
