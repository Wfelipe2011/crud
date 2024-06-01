import { useEffect, useState } from "react";
import ReactCrop from "react-image-crop";
import image_placeholder from "../../image/imagem-placeholder.jpg";
import { ModalPopUp } from "../ModalPopUp";
import toast, { Toaster } from "react-hot-toast";
import "react-image-crop/dist/ReactCrop.css";
import "./index.css";
import { ImageIcon, SaveIcon, TrashIcon } from "lucide-react";

export function UploadImage({
  img = image_placeholder,
  setImage: uploadImage,
  className = "",
  handleDeleteImage,
}) {
  const [imagemOfClient, setImagemOfClient] = useState(img);
  const [image, setImage] = useState<any>(null);
  const [viewImage, setViewImage] = useState("");
  const [src, setSrc] = useState("");
  const [modalEdit, setModalEdit] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [result, setResult] = useState(null);
  const [crop, setCrop] = useState<any>({ aspect: 9 / 9 });
  const [clickDeleteImage, setClickDeleteImage] = useState(false);

  useEffect(() => {
    if (img) {
      setImagemOfClient(img);
      setViewImage(img);
    } else {
      setImagemOfClient(image_placeholder);
      setViewImage(image_placeholder);
    }
  }, [img]);

  const handleFileChange = (e: any) => {
    if (!e?.target?.files[0]) return;
    const isNotFileImage = !e?.target?.files[0]?.type.includes("image/");
    if (isNotFileImage)
      return toast.error("Esse arquivo não é do tipo Imagem!");
    setSrc(URL?.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
  };

  function getCroppedImg() {
    if (!image) return;

    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    canvas?.toBlob((blob) => {
      setResult(blob);
    });
  }

  function handleStateModal() {
    setStatusModal((oldStatus) => !oldStatus);
  }

  function SaveImageModal() {
    function handleClickSave() {
      setModalEdit(false);
      handleStateModal();
      uploadImage(result || imagemOfClient);
      setViewImage(result ? URL?.createObjectURL(result) : imagemOfClient);
      if (clickDeleteImage) handleDeleteImage();
    }

    return (
      <button
        onClick={() => handleClickSave()}
        type="button"
        className="button-cropper-save bg-primary-500 justify-center items-center cursor-pointer image-contrast font-poppins gap-1"
      >
        {imagemOfClient ? "Salvar" : "Salvar Corte"}
      </button>
    );
  }

  function SaveDisabled() {
    return (
      <button
        type="button"
        disabled={true}
        className="button-cropper-save-blocked bg-gray-500 font-poppins font-bold text-white w-[200px] rounded-md justify-center items-center cursor-not-allowed font-poppins gap-1 image-contrast"
      >
        Salvar{" "}
      </button>
    );
  }

  function clearValuesImage() {
    setImage(null);
    setResult(null);
    uploadImage("");
    setSrc("");
    setViewImage("");
    setImagemOfClient(image_placeholder);
    setClickDeleteImage(true);
  }

  function DeleteButton() {
    return (
      <button
        type="button"
        className="button-cropper button-remove-image hover:bg-primary-300 text-primary-600"
        onClick={() => clearValuesImage()}
      >
        Apagar
      </button>
    );
  }

  return (
    <>
      <Toaster />
      <ModalPopUp
        className="w-[50vw] min-h-[50vh]"
        title="Editar imagem"
        status={statusModal}
        onClickCancel={handleStateModal}
      >
        {imagemOfClient && !src ? (
          <div className="flex justify-center">
            <img
              src={imagemOfClient}
              className=""
              width="150px"
              height="150px"
            />
          </div>
        ) : src ? (
          <div className="w-full flex justify-around mx-2">
            <div
              onTouchMoveCapture={getCroppedImg}
              onMouseMoveCapture={getCroppedImg}
              className="flex"
            >
              <ReactCrop
                src={src}
                onImageLoaded={setImage}
                imageStyle={{ maxHeight: 300, maxWidth: 300 }}
                crop={crop}
                onChange={setCrop}
                minWidth={75}
                minHeight={75}
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  flexDirection: "row",
                  cursor: "crosshair",
                }}
                circularCrop={true}
              />
            </div>
            {!result ? (
              <p className="flex justify-center items-center w-1/3 text-xl text-center">
                Para salvar, recorte a imagem ao lado em formato de círcular.
              </p>
            ) : (
              ""
            )}
            {result && (
              <div className="flex items-center">
                <img
                  src={URL.createObjectURL(result)}
                  alt="Image"
                  width="200"
                  height="200"
                  className="rounded-full"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center">
            <img
              src={image_placeholder}
              width="150px"
              height="150px"
              className="image-placeholder-modal"
            />
          </div>
        )}
        <div className={`w-full flex mt-10 justify-between`}>
          <label className="label-input-file flex justify-center items-center input-type-file bg-primary-500 cursor-pointer rounded-md">
            <span className="image-contrast gap-4 justify-center items-center text-center text-white">
              {" "}
              {imagemOfClient || viewImage
                ? "Trocar Imagem"
                : "Adicionar Imagem"}{" "}
            </span>
            <input
              type="file"
              name="image"
              onChange={(e) => {
                handleFileChange(e);
                setResult(null);
              }}
              accept=".png, .jpg, .jpeg"
            />
          </label>
          <DeleteButton />
          {result ? <SaveImageModal /> : <SaveDisabled />}
        </div>
      </ModalPopUp>
      <div>
        {modalEdit ? (
          <div>
            <button type="button">Save</button>
          </div>
        ) : (
          <>
            {imagemOfClient ? (
              <label className={`input-type-file cursor-pointer ${className}`}>
                <img
                  src={viewImage || imagemOfClient}
                  onClick={handleStateModal}
                  width="160px"
                  height="160px"
                  className="rounded-full"
                />
              </label>
            ) : (
              <label className={`input-type-file cursor-pointer ${className}`}>
                <img
                  onClick={handleStateModal}
                  src={viewImage || image_placeholder}
                  alt="Image"
                  width="160px"
                  height="160px"
                  className="rounded-full"
                />
              </label>
            )}
          </>
        )}
      </div>
    </>
  );
}
