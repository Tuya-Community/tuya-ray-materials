import React, { Fragment, useState } from "react";
import { Modal, View, Button } from "@ray-js/ray-next";
import styles from "./index.module.less";
import clsx from "clsx";

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
				position="center"
				overlay={true}
				onClickOverlay={toggleModal}
			>
				<View className={clsx(styles.modalContent, styles.wFull)}>content</View>
			</Modal>
		</Fragment>
	);
}
