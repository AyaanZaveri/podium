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
        rssJson?.channel["itunes:summary"] ? (
          <div className="flex justify-start gap-8">
            <img
              className={`w-64 h-64 rounded-lg shadow-slate-800/30 ${
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
              src={rssJson?.channel?.image?.url}
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
        ) : (
          <div
            role="status"
            className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 md:flex md:items-center"
          >
            <div className="flex justify-center items-center w-64 h-64 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
              <svg
                className="w-12 h-12 text-gray-200"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 640 512"
              >
                <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
              </svg>
            </div>
            <div className="w-full">
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
            </div>
            <span className="sr-only">Loading...</span>
          </div>
        )}
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
