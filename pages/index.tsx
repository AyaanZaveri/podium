import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState } from "react";
var convert = require("xml-js");
// @ts-ignore
import ColorThief from "../node_modules/colorthief/dist/color-thief.mjs";

const Home: NextPage = () => {
  const [rssJson, setRssJson] = useState<any>();
  const [rssUrl, setRssUrl] = useState<any>();
  const [imgDomColor, setImgDomColor] = useState<any>();
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const imgRef = useRef<any>();

  function RemoveJsonTextAttribute(value: any, parentElement: any) {
    try {
      var keyNo = Object.keys(parentElement._parent).length;
      var keyName = Object.keys(parentElement._parent)[keyNo - 1];
      parentElement._parent[keyName] = value;
    } catch (e) {}
  }

  const getRssJson = () => {
    if (rssUrl?.length > 2) {
      axios
        .get(
          "https://cors-anywhere.7ih.repl.co/" +
            rssUrl.replace("https://", "").replace("http://", "")
        )
        .then((res) =>
          setRssJson(
            JSON.parse(
              convert.xml2json(res?.data, {
                compact: true,
                spaces: 4,
                nativeType: true,
                textFn: RemoveJsonTextAttribute,
                cdataFn: RemoveJsonTextAttribute,
              })
            )?.rss
          )
        );
    }
  };

  console.log(rssJson?.channel);

  // https://feedproxy.google.com/WaveformWithMkbhd
  // https://feeds.megaphone.fm/vergecast
  // https://feeds.npr.org/510338/podcast.xml

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2 gap-6">
      <div className="flex items-center w-2/3 flex-col gap-12">
        {rssJson?.channel?.image?.url &&
        rssJson?.channel?.title &&
        rssJson?.channel?.description ? (
          <div className="flex justify-start gap-8">
            <img
              className={`w-64 h-64 rounded-xl ${
                imageLoaded ? "block" : "hidden"
              }`}
              style={{
                boxShadow: `0 20px 25px -5px rgba(${
                  imgDomColor?.length > 0 ? imgDomColor[0] : 0
                },${imgDomColor?.length > 0 ? imgDomColor[1] : 0},${
                  imgDomColor?.length > 0 ? imgDomColor[2] : 0
                }, 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.1)`,
              }}
              crossOrigin={"anonymous"}
              src={
                "https://cors-anywhere.7ih.repl.co/" +
                rssJson?.channel?.image?.url
                  .replace("https://", "")
                  .replace("http://", "")
              }
              ref={imgRef}
              alt=""
              onLoad={() => {
                const colorThief = new ColorThief();
                const img = imgRef.current;
                const result = colorThief.getColor(img, 25);
                setImgDomColor(result);
                setImageLoaded(true);
              }}
            />
            <div className="flex flex-col gap-3 mt-3">
              <span className="text-3xl font-bold text-slate-700">
                {rssJson?.channel?.title}
              </span>

              <span
                className="text-slate-700"
                dangerouslySetInnerHTML={{
                  __html: rssJson?.channel?.description,
                }}
              ></span>
            </div>
          </div>
        ) : null}
        <div className="flex flex-row gap-2 w-full">
          <input
            className="border rounded-md px-3 py-1.5 shadow-sm hover:bg-slate-50 active:bg-slate-100 transition duration-300 ease-in-out w-full outline-none focus:ring-amber-200 focus:ring focus:border-amber-500"
            type="text"
            onChange={(e) => setRssUrl(e.target.value)}
          />
          <button
            className="border rounded-md w-44 px-5 py-1 shadow-sm hover:bg-slate-50 active:bg-slate-100 transition duration-300 ease-in-out outline-none focus:ring-amber-200 focus:ring focus:border-amber-500"
            onClick={getRssJson}
          >
            Try Podcast
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
