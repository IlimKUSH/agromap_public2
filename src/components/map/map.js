"use client";
import {useEffect, useRef, useState} from "react";
import Map from "ol/Map";
import View from "ol/View";
import {defaults as defaultControls} from "ol/control";
import "ol/ol.css";
import Box from "@mui/material/Box";
import {fromLonLat} from "ol/proj";
import {ImageWMS} from "ol/source";
import ImageLayer from "ol/layer/Image";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {Style, Fill, Stroke} from "ol/style";
import {GeoJSON} from "ol/format";
import { useMapStore } from "@/stores/map";

const GEOSERVER_URL = "https://agro.brisklyminds.com/geoserver/agromapv2/wms";
const AGROMAP_LAYER = "agromapv2:2024";

export function MapComponent({regionsData, districtsData, getDistrictsData, getIndexes, activeRegion, setActiveRegion, activeDistrict, setActiveDistrict, clearActive}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const wmsSourceRef = useRef(null);
  const vectorLayerRef = useRef(null);
  const highlightedFeatureRef = useRef(null);
  const districtsLayerRef = useRef(null);
  const highlightedDistrictRef = useRef(null);

  const [initialHighlight, setInitialHighlight] = useState("Чуйская");

  const { setRegion, setDistricts } = useMapStore((state) => state)

  const regionStyle = (feature) => {
    const regionName = feature.get("adm1_ru");
    if (activeRegion && regionName === activeRegion) {
      return new Style({
        stroke: new Stroke({
          color: "rgba(255, 140, 0, 1)",
          width: 4,
        }),
        fill: new Fill({
          color: "rgba(255, 140, 0, 0.3)",
        }),
      });
    }
    if (initialHighlight && regionName === initialHighlight) {
      return new Style({
        stroke: new Stroke({
          color: "rgba(0, 200, 0, 1)",
          width: 3,
        }),
        fill: new Fill({
          color: "rgba(0, 123, 255, 0.1)",
        }),
      });
    }
    return new Style({
      stroke: new Stroke({
        color: "rgba(0, 123, 255, 0.8)",
        width: 2,
      }),
      fill: new Fill({
        color: "rgba(0, 123, 255, 0.1)",
      }),
    });
  };

  const districtStyle = (feature) => {
    const districtName = feature.get("adm2_ru");
    if (activeDistrict && districtName === activeDistrict) {
      return new Style({
        stroke: new Stroke({
          color: "rgba(0, 0, 255, 1)",
          width: 4,
        }),
        fill: new Fill({
          color: "rgba(0, 0, 255, 0.2)",
        }),
      });
    }
    return new Style({
      stroke: new Stroke({
        color: "rgba(255, 0, 0, 0.8)",
        width: 2,
      }),
      fill: new Fill({
        color: "rgba(255, 0, 0, 0.1)",
      }),
    });
  };

  useEffect(() => {
    let map;
    if (mapRef.current && !mapInstanceRef.current) {
      wmsSourceRef.current = new ImageWMS({
        url: GEOSERVER_URL,
        params: {
          LAYERS: AGROMAP_LAYER,
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

      map = new Map({
        target: mapRef.current,
        layers: [geoServerLayer],
        view: new View({
          center: fromLonLat([74.6, 41.3]),
          zoom: 7,
        }),
        controls: defaultControls({
          zoom: true,
          rotate: false,
          attribution: false,
        }),
      });

      mapInstanceRef.current = map;

      const highlightRegionStyle = new Style({
        stroke: new Stroke({ color: "rgba(255, 204, 0, 0.8)", width: 3 }),
        fill: new Fill({ color: "rgba(255, 204, 0, 0.4)" }),
      });

      const highlightDistrictStyle = new Style({
        stroke: new Stroke({ color: "rgba(255, 0, 0, 0.8)", width: 3 }),
        fill: new Fill({ color: "rgba(255, 0, 0, 0.2)" }),
      });

      function handlePointerMove(e) {
        if (e.dragging) return;
        const pixel = map.getEventPixel(e.originalEvent);

        let hasFeature = false;

        // Region hover
        let regionFeature = map.forEachFeatureAtPixel(
          pixel,
          (feature) => feature,
          { layerFilter: (layer) => layer === vectorLayerRef.current, hitTolerance: 5 }
        );
        if (highlightedFeatureRef.current) {
          highlightedFeatureRef.current.setStyle(undefined);
          highlightedFeatureRef.current = null;
        }
        if (regionFeature) {
          regionFeature.setStyle(highlightRegionStyle);
          highlightedFeatureRef.current = regionFeature;
          hasFeature = true;
        }

        // District hover
        let districtFeature = map.forEachFeatureAtPixel(
          pixel,
          (feature) => feature,
          { layerFilter: (layer) => layer === districtsLayerRef.current, hitTolerance: 5 }
        );
        if (highlightedDistrictRef.current) {
          highlightedDistrictRef.current.setStyle(undefined);
          highlightedDistrictRef.current = null;
        }
        if (districtFeature) {
          districtFeature.setStyle(highlightDistrictStyle);
          highlightedDistrictRef.current = districtFeature;
          hasFeature = true;
        }

        // Cursor
        const targetElement = map.getTargetElement();
        if (hasFeature) {
          targetElement.style.cursor = 'pointer';
        } else {
          targetElement.style.cursor = '';
        }
      }

      function handleSingleClick(e) {
        // District click
        const districtFeature = map.forEachFeatureAtPixel(
          e.pixel,
          (feature) => feature,
          { layerFilter: (layer) => layer === districtsLayerRef.current, hitTolerance: 5 }
        );
        if (districtFeature) {
          const districtName = districtFeature.get('adm2_ru');
          setActiveDistrict(districtName);
          setActiveRegion(null);
          getIndexes("district", districtName)
          return;
        }
        // Region click
        const regionFeature = map.forEachFeatureAtPixel(
          e.pixel,
          (feature) => feature,
          { layerFilter: (layer) => layer === vectorLayerRef.current, hitTolerance: 5 }
        );
        if (regionFeature) {
          const regionName = regionFeature.get('adm1_ru');
          setActiveRegion(regionName);
          setActiveDistrict(null);
          setRegion(`${regionName} ${regionFeature.get('adm1typ_ru')}`)
          getDistrictsData(regionName);
          getIndexes("region", regionName)
          if (initialHighlight && regionName !== initialHighlight) {
            setInitialHighlight(null);
          }
        }
      }

      map.on("pointermove", handlePointerMove);
      map.on("singleclick", handleSingleClick);
    }

    return () => {
      if (map) {
        map.setTarget(undefined);
        map.un("pointermove", handlePointerMove);
        map.un("singleclick", handleSingleClick);
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && regionsData) {
      if (vectorLayerRef.current) {
        mapInstanceRef.current.removeLayer(vectorLayerRef.current);
      }

      const vectorSource = new VectorSource({
        features: new GeoJSON({featureProjection: "EPSG:3857"}).readFeatures(
          regionsData
        ),
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: regionStyle,
      });

      vectorLayerRef.current = vectorLayer;
      mapInstanceRef.current.addLayer(vectorLayer);
    }
  }, [regionsData, initialHighlight, activeRegion]);

  useEffect(() => {
    if (mapInstanceRef.current && districtsData) {
      setDistricts(districtsData)
      if (districtsLayerRef.current) {
        mapInstanceRef.current.removeLayer(districtsLayerRef.current);
      }
      const vectorSource = new VectorSource({
        features: new GeoJSON({featureProjection: "EPSG:3857"}).readFeatures(
          districtsData
        ),
      });
      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: districtStyle,
      });
      districtsLayerRef.current = vectorLayer;
      mapInstanceRef.current.addLayer(vectorLayer);
    }
  }, [districtsData, activeDistrict]);

  return (
    <Box sx={{width: "100%", height: "100%", position: "relative"}}>
      <Box
        ref={mapRef}
        sx={{width: "100%", height: "100%", position: "relative", inset: 0}}
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
        <h4 style={{margin: "0 0 8px 0", fontSize: "14px"}}>
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
          <span style={{fontSize: "12px"}}>Области</span>
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
