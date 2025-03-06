"use client";
import {useEffect, useRef, useState} from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import {Style, Stroke, Fill, Text, Icon} from "ol/style";
import { defaults as defaultControls } from "ol/control";
import "ol/ol.css";
import Box from "@mui/material/Box";
import { fromLonLat, transformExtent } from "ol/proj";
import {WMTSCapabilities} from "ol/format";
import {optionsFromCapabilities} from "ol/source/WMTS";
import {ImageWMS, WMTS} from "ol/source";
import {Feature} from "ol";
import {Point} from "ol/geom";
import ImageLayer from "ol/layer/Image";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export function MapComponent() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const geoServerURL = "https://geoserver.24mycrm.com/agromap/wms";
  const [layers, setLayers] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState("agromap:FULL_KR_TCI"); // Default layer
  const wmsSourceRef = useRef(null);

  // const fetchLayers = async () => {
  //   try {
  //     const response = await fetch(
  //       `${geoServerURL}?service=WMS&request=GetCapabilities&version=1.1.1`
  //     );
  //     const text = await response.text();
  //     const parser = new DOMParser();
  //     const xml = parser.parseFromString(text, "text/xml");
  //
  //     // Extract layers from XML
  //     const layers = Array.from(xml.getElementsByTagName("Layer"))
  //       .map((layer) => {
  //         const name = layer.getElementsByTagName("Name")[0]?.textContent;
  //         const title = layer.getElementsByTagName("Title")[0]?.textContent;
  //         return name ? { name, title } : null;
  //       })
  //       .filter(Boolean);
  //
  //     return layers;
  //   } catch (error) {
  //     console.error("Error fetching layers:", error);
  //     return [];
  //   }
  // };

// Usage Example
//   useEffect(() => {
//     fetchLayers().then((layers) => console.log("Available layers:", layers));
//   }, []);


  useEffect(() => {
    // Fetch available layers from GeoServer
    const fetchLayers = async () => {
      try {
        const response = await fetch(
          `${geoServerURL}?service=WMS&request=GetCapabilities&version=1.1.1`
        );
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");

        const availableLayers = Array.from(xml.getElementsByTagName("Layer"))
          .map((layer) => {
            const name = layer.getElementsByTagName("Name")[0]?.textContent;
            const title = layer.getElementsByTagName("Title")[0]?.textContent;
            return name ? { name, title } : null;
          })
          .filter(Boolean);

        setLayers(availableLayers);
      } catch (error) {
        console.error("Error fetching layers:", error);
      }
    };

    fetchLayers();
  }, []);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const osmLayer = new TileLayer({
        source: new OSM(),
      });

      // Initial WMS Layer
      wmsSourceRef.current = new ImageWMS({
        url: geoServerURL,
        params: {
          LAYERS: selectedLayer,
          FORMAT: "image/png",
          TRANSPARENT: true,
          VERSION: "1.1.1",
        },
        serverType: "geoserver",
        crossOrigin: "anonymous",
      });

      const geoServerLayer = new ImageLayer({
        source: wmsSourceRef.current,
      });

      const map = new Map({
        target: mapRef.current,
        layers: [osmLayer, geoServerLayer],
        view: new View({
          center: fromLonLat([74.6, 41.3]),
          zoom: 7,
          minZoom: 5,
          maxZoom: 18,
        }),
        controls: defaultControls({
          zoom: true,
          rotate: false,
          attribution: false,
        }),
      });

      mapInstanceRef.current = map;
    } else if (wmsSourceRef.current) {
      wmsSourceRef.current.updateParams({ LAYERS: selectedLayer });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
        mapInstanceRef.current = null;
      }
    };
  }, [selectedLayer]);


  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
      <Box sx={{ position: "absolute", top: 16, left: 16, zIndex: 1000 }}>
        <Select
          value={selectedLayer}
          onChange={(e) => setSelectedLayer(e.target.value)}
          size="small"
          sx={{ backgroundColor: "white", borderRadius: "8px", padding: "4px" }}
        >
          {layers.map((layer) => (
            <MenuItem key={layer.name} value={layer.name}>
              {layer.title}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box
        ref={mapRef}
        sx={{ width: "100%", height: "100%", position: "relative", inset: 0 }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          left: 16,
          padding: "12px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
        }}
      >
        <h4 style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
          Условные обозначения:
        </h4>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: "rgba(0, 123, 255, 0.3)",
              border: "2px solid #007bff",
              marginRight: "8px",
            }}
          />
          <span style={{ fontSize: "12px" }}>Области</span>
        </div>
        <div>
          <div
            style={{
              width: "100%",
              height: "16px",
              background: "linear-gradient(to right, #fff, #80a179)",
              borderRadius: "8px",
              marginTop: "4px",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10px",
              marginTop: "4px",
            }}
          >
            <span>Слабый</span>
            <span>Сильный</span>
          </div>
        </div>
      </Box>
    </Box>
  );
}
