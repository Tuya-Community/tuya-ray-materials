import React, { Fragment, useState } from "react";
import clsx from "clsx";
import { Modal, View, Button } from "@ray-js/ray-next";
import styles from "./index.module.less";

export default function () {
	const [isShowModal, setIsShowModal] = useState(false);
	const toggleModal = () => {
		setIsShowModal(!isShowModal);
	};
	return (
		<Fragment>
			<Button onClick={toggleModal}>{I18n.t('toggleModal')}</Button>
			<Modal
				show={isShowModal}
				position="top"
				overlay={true}
				onClickOverlay={toggleModal}
			>
				<View className={clsx(styles.modalContent, styles.wFull)}>content</View>
			</Modal>
		</Fragment>
	);
}
