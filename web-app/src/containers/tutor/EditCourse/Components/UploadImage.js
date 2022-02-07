import React, { useState, useEffect } from "react";
import { Layout, Container, BoxUpload, ImagePreview } from "./style";
import { useDispatch } from "react-redux";
import { setCourseCoverBlob, setCourseCoverName } from "../../../../reducers/createCourseSlice";

import FolderIcon from "./assets/folder_icon_transparent.png";
import CloseIcon from "./assets/CloseIcon.svg";

function UploadImage({ image, onChange }) {
	const dispatch = useDispatch();
	const [preview, setPreview] = useState(image);
	const [isUploaded, setIsUploaded] = useState(false);
	const [fileType, setFileType] = useState("");

	useEffect(() => {
		if (image) {
			setPreview(image);
			setIsUploaded(true);
		}
	}, [image]);

	function handleImageChange(e) {
		e.persist();
		if (e.target.files && e.target.files[0]) {
			setFileType(e.target.files[0].type);
			let reader = new FileReader();
			reader.readAsDataURL(e.target.files[0]);
			dispatch(setCourseCoverBlob(window.URL.createObjectURL(e.target.files[0])));
			dispatch(setCourseCoverName(e.target.files[0].name));

			reader.onload = function (e) {
				setPreview(e.target.result);
				setIsUploaded(true);
				onChange(e);
			};
		}
	}

	return (
		<Layout>
			<Container>
			<BoxUpload>
				<div className="image-upload">
				{!isUploaded ? (
					<>
					<label htmlFor="upload-input">
						<img
							src={FolderIcon}
							draggable={"false"}
							alt="placeholder"
							style={{ width: 100, height: 100 }}
						/>
						<p style={{ color: "#444" }}>Click to upload a cover photo</p>
					</label>

					<input
						id="upload-input"
						type="file"
						accept=".jpg,.jpeg,.gif,.png,.mov,.mp4"
						onChange={handleImageChange}
					/>
					</>
				) : (
					<ImagePreview>
						<img
							className="close-icon"
							src={CloseIcon}
							alt="CloseIcon"
							onClick={() => {
								setIsUploaded(false);
								setPreview(FolderIcon);
							}}
						/>
						{fileType.includes("video") ? (
							<video
								id="uploaded-image"
								src={preview}
								draggable={false}
								controls
								autoPlay
								alt="uploaded-img"
							/>
						) : (
							<img
								id="uploaded-image"
								src={preview}
								draggable={false}
								alt="uploaded-img"
							/>
						)}
					</ImagePreview>
				)}
				</div>
			</BoxUpload>

			</Container>
		</Layout>
	);
}

export default UploadImage;
