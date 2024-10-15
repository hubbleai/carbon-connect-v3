import React from "react";
import { images } from "@assets/index";

const getFileIcon = (fileName: string): string => {
  const extension = fileName.split(".").pop();

  const image = fileName.split("/").pop();

  switch (extension) {
    case "sheet":
      return images.xlsx;
    case "presentation":
      return images.pptx;
    case "document":
      return images.docx;
  }
  switch (image) {
    case "":
      return images.folderIcon;
    case "html":
      return images.html;
    case "zip":
      return images.folderIcon;

    case "pdf":
      return images.pdf;
    case "mp4":
      return images.mp4;
    case "mp3":
      return images.mp3;
    case "mpeg":
      return images.mp3;
    case "mp2":
      return images.mp2;
    case "aac":
      return images.acc;
    case "wav":
      return images.wav;
    case "flac":
      return images.flac;
    case "pcm":
      return images.pcm;
    case "m4a":
      return images.m4a;
    case "ogg":
      return images.ogg;
    case "opus":
      return images.opus;
    case "webm":
      return images.webm;
    case "png":
      return images.png;

    case "csv":
      return images.csv;
    case "docx":
      return images.docx;
    case "txt":
      return images.txt;
    case "md":
      return images.md;
    case "rtf":
      return images.rtf;
    case "tsv":
      return images.tsv;
    case "plain":
      return images.txt;

    case "json":
      return images.json;
    case "jpeg":
    case "jpg":
      return images.jpg;
    default:
      return "image";
  }
};

const FileExtension = ({ fileName }: { fileName: string }) => {
  const fileIcon = getFileIcon(fileName);
  return (
    <div className="cc-w-[48px] cc-h-[48px] md:cc-w-[40px] md:cc-h-[40px] dark:cc-bg-[#292929]  cc-rounded-full cc-bg-[#F3F3F4] cc-flex cc-justify-center cc-items-center">
      <img
        className="cc-w-[24px] cc-h-[24px] md:cc-w-[20px] md:cc-h-[20px] "
        src={fileIcon}
        alt="image"
      />
    </div>
  );
};

export default FileExtension;
