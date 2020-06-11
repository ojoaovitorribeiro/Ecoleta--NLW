import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./styles.css";
import { FiUpload } from "react-icons/fi";

interface Props {
  onFile: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFile }) => {
  const [imagemUrl, setImagemUrl] = useState("");

  const onDrop = useCallback(
    (aceitarArquivo) => {
      const file = aceitarArquivo[0];

      const fileUrl = URL.createObjectURL(file);

      setImagemUrl(fileUrl);
      onFile(file);

      console.log("arquivo aceito!", aceitarArquivo);
    },
    [onFile]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  });
  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />
      {imagemUrl ? (
        <img src={imagemUrl} alt="Point" />
      ) : (
        <p>
          <FiUpload />
          Imagem do estabelecimento
        </p>
      )}
    </div>
  );
};
export default Dropzone;
