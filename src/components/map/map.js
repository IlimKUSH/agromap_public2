'use client'
import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import { defaults as defaultControls } from 'ol/control'
import 'ol/ol.css'
import Box from '@mui/material/Box'
import { fromLonLat } from 'ol/proj'
import { ImageWMS } from 'ol/source'
import ImageLayer from 'ol/layer/Image'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { Style, Fill, Stroke, Text } from 'ol/style'
import { GeoJSON } from 'ol/format'
import { useMapStore } from '@/stores/map'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'

const GEOSERVER_URL = 'https://agro.brisklyminds.com/geoserver/agromapv2/wms'
const AGROMAP_LAYER = 'agromapv2:2024'

export const MapComponent = forwardRef(
  (
    {
      indexDictionaryData,
      regionsData,
      districtsData,
      getDistrictsData,
      getIndexes,
      activeRegion,
      setActiveRegion,
      activeDistrict,
      setActiveDistrict,
      activeType,
      indexData,
      districtsIndexData,
      indexColors,
    },
    ref
  ) => {
    const mapRef = useRef(null)
    const mapInstanceRef = useRef(null)
    const wmsSourceRef = useRef(null)
    const vectorLayerRef = useRef(null)
    const highlightedFeatureRef = useRef(null)
    const districtsLayerRef = useRef(null)
    const highlightedDistrictRef = useRef(null)

    const [initialHighlight, setInitialHighlight] = useState('Чуйская')

    const { setRegion, setDistricts } = useMapStore((state) => state)

    const getIndexColor = (type) => {
      return indexColors?.[type] || '#209661'
    }
    const getRegionIndex = (name) => {
      const foundItem = indexData?.find((item) => item.name === name)
      const index = foundItem?.data.find((d) => d.type === activeType)
      const matchedIndex = indexDictionaryData?.find(
        (ix) => ix.value === index?.type
      )

      if (matchedIndex && index) {
        return `${matchedIndex.title_ru}: ${index.viIndex}`
      }
      return null
    }

    const getDistrictIndex = (name) => {
      const foundItem = districtsIndexData?.find((item) => item.name === name)
      const index = foundItem?.data.find((d) => d.type === activeType)
      const matchedIndex = indexDictionaryData?.find(
        (ix) => ix.value === index?.type
      )

      if (matchedIndex && index) {
        return `${matchedIndex.title_ru}: ${index.viIndex}`
      }
      return null
    }
    // Обновлённый стиль для области
    const regionStyle = (feature) => {
      const regionName = feature.get('adm1_ru')
      const index = getRegionIndex(regionName)

      const isActive = activeRegion && regionName === activeRegion
      const isInitial = initialHighlight && regionName === initialHighlight

      return new Style({
        stroke: new Stroke({
          color: 'rgba(0, 82, 180, 1)',
          width: isActive || isInitial ? 2 : 1.5,
        }),
        fill: new Fill({
          color: isActive
            ? 'rgba(204, 221, 255, 0.4)'
            : isInitial
              ? 'rgba(204, 221, 255, 0.7)'
              : 'rgba(204, 221, 255, 0.2)',
        }),
        text: new Text({
          text: index,
          font: 'bold 16px Arial',
          fill: new Fill({ color: getIndexColor(activeType) }),
          stroke: new Stroke({ color: '#fff', width: 3 }),
          backgroundFill: new Fill({ color: '#FFF' }),
          backgroundStroke: new Stroke({ color: '#fff', width: 3 }),
          padding: [2, 2, 2, 2],
        }),
      })
    }

    // Обновлённый стиль для района
    const districtStyle = (feature) => {
      const districtName = feature.get('adm2_ru')
      const index = getDistrictIndex(districtName)
      const isActive = activeDistrict && districtName === activeDistrict

      return new Style({
        stroke: new Stroke({
          color: isActive ? 'rgba(0, 64, 128, 1)' : 'rgba(0, 82, 180, 1)',
          width: isActive ? 3 : 1.5,
        }),
        fill: new Fill({
          color: isActive
            ? 'rgba(179, 212, 255, 0.5)'
            : 'rgba(204, 221, 255, 0.2)',
        }),
        text: new Text({
          text: index,
          font: 'bold 16px Arial',
          fill: new Fill({ color: getIndexColor(activeType) }),
          stroke: new Stroke({ color: '#fff', width: 3 }),
          backgroundFill: new Fill({ color: '#FFF' }),
          backgroundStroke: new Stroke({ color: '#fff', width: 3 }),
          padding: [2, 2, 2, 2],
        }),
      })
    }

    // Стиль при наведении на область
    const regionHighlightStyle = (feature) => {
      const name = feature.get('adm1_ru')
      const region = feature.get('adm1typ_ru')

      return new Style({
        stroke: new Stroke({
          color: 'rgba(0, 38, 84, 1)',
          width: 3,
        }),
        fill: new Fill({
          color: 'rgba(173, 216, 230, 0.5)',
        }),
        text: new Text({
          text: `${name} ${region}`,
          font: 'bold 16px Arial',
          fill: new Fill({ color: getIndexColor(activeType) }),
          stroke: new Stroke({ color: '#fff', width: 3 }),
          backgroundFill: new Fill({ color: '#FFF' }),
          backgroundStroke: new Stroke({ color: '#fff', width: 3 }),
          padding: [2, 2, 2, 2],
        }),
      })
    }

    // Стиль при наведении на район
    const districtHighlightStyle = (feature) => {
      const name = feature.get('adm2_ru')
      const district = feature.get('adm2typ_ru')

      return new Style({
        stroke: new Stroke({
          color: 'rgba(0, 51, 102, 1)',
          width: 2.5,
        }),
        fill: new Fill({
          color: 'rgba(173, 216, 230, 0.3)',
        }),
        text: new Text({
          text: `${name} ${district}`,
          font: 'bold 16px Arial',
          fill: new Fill({ color: getIndexColor(activeType) }),
          stroke: new Stroke({ color: '#fff', width: 3 }),
          backgroundFill: new Fill({ color: '#FFF' }),
          backgroundStroke: new Stroke({ color: '#fff', width: 3 }),
          padding: [2, 2, 2, 2],
        }),
      })
    }

    useEffect(() => {
      let map
      if (mapRef.current && !mapInstanceRef.current) {
        const osmLayer = new TileLayer({
          source: new OSM(),
        })

        wmsSourceRef.current = new ImageWMS({
          url: GEOSERVER_URL,
          params: {
            LAYERS: AGROMAP_LAYER,
            FORMAT: 'image/png',
            TRANSPARENT: true,
            VERSION: '1.1.1',
          },
          serverType: 'geoserver',
          crossOrigin: 'anonymous',
        })

        const geoServerLayer = new ImageLayer({
          source: wmsSourceRef.current,
        })

        map = new Map({
          target: mapRef.current,
          layers: [osmLayer, geoServerLayer],
          view: new View({
            center: fromLonLat([74.6, 41.3]),
            zoom: 7,
          }),
          controls: defaultControls({
            zoom: true,
            rotate: false,
            attribution: false,
          }),
        })

        mapInstanceRef.current = map

        function handlePointerMove(e) {
          if (e.dragging) return
          const pixel = map.getEventPixel(e.originalEvent)

          let hasFeature = false

          // Region hover
          let regionFeature = map.forEachFeatureAtPixel(
            pixel,
            (feature) => feature,
            {
              layerFilter: (layer) => layer === vectorLayerRef.current,
              hitTolerance: 5,
            }
          )
          if (highlightedFeatureRef.current) {
            highlightedFeatureRef.current.setStyle(undefined)
            highlightedFeatureRef.current = null
          }
          if (regionFeature) {
            regionFeature.setStyle(regionHighlightStyle(regionFeature))
            highlightedFeatureRef.current = regionFeature
            hasFeature = true
          }

          // District hover
          let districtFeature = map.forEachFeatureAtPixel(
            pixel,
            (feature) => feature,
            {
              layerFilter: (layer) => layer === districtsLayerRef.current,
              hitTolerance: 5,
            }
          )
          if (highlightedDistrictRef.current) {
            highlightedDistrictRef.current.setStyle(undefined)
            highlightedDistrictRef.current = null
          }
          if (districtFeature) {
            districtFeature.setStyle(districtHighlightStyle(districtFeature))
            highlightedDistrictRef.current = districtFeature
            hasFeature = true
          }

          // Cursor
          const targetElement = map.getTargetElement()
          if (hasFeature) {
            targetElement.style.cursor = 'pointer'
          } else {
            targetElement.style.cursor = ''
          }
        }

        function handleSingleClick(e) {
          // District click
          const districtFeature = map.forEachFeatureAtPixel(
            e.pixel,
            (feature) => feature,
            {
              layerFilter: (layer) => layer === districtsLayerRef.current,
              hitTolerance: 5,
            }
          )
          if (districtFeature) {
            const districtName = districtFeature.get('adm2_ru')
            setActiveDistrict(districtName)
            setActiveRegion(null)
            getIndexes('district', districtName)
            // Zoom to district
            const geometry = districtFeature.getGeometry()
            const extent = geometry.getExtent()
            map.getView().fit(extent, {
              duration: 500,
              maxZoom: 12,
              padding: [40, 40, 40, 40],
            })
            return
          }
          // Region click
          const regionFeature = map.forEachFeatureAtPixel(
            e.pixel,
            (feature) => feature,
            {
              layerFilter: (layer) => layer === vectorLayerRef.current,
              hitTolerance: 5,
            }
          )
          if (regionFeature) {
            const regionName = regionFeature.get('adm1_ru')
            setActiveRegion(regionName)
            setActiveDistrict(null)
            setRegion(`${regionName} ${regionFeature.get('adm1typ_ru')}`)
            getDistrictsData(regionName)
            getIndexes('region', regionName)
            if (initialHighlight && regionName !== initialHighlight) {
              setInitialHighlight(null)
            }
            // Zoom to region
            const geometry = regionFeature.getGeometry()
            const extent = geometry.getExtent()
            map.getView().fit(extent, {
              duration: 500,
              maxZoom: 10,
              padding: [40, 40, 40, 40],
            })
          }
        }

        map.on('pointermove', handlePointerMove)
        map.on('singleclick', handleSingleClick)
      }

      return () => {
        if (map) {
          map.setTarget(undefined)
          map.un('pointermove', handlePointerMove)
          map.un('singleclick', handleSingleClick)
        }
      }
    }, [])

    useEffect(() => {
      if (mapInstanceRef.current && regionsData) {
        if (vectorLayerRef.current) {
          mapInstanceRef.current.removeLayer(vectorLayerRef.current)
        }

        const vectorSource = new VectorSource({
          features: new GeoJSON({
            featureProjection: 'EPSG:3857',
          }).readFeatures(regionsData),
        })

        const vectorLayer = new VectorLayer({
          source: vectorSource,
          style: regionStyle,
        })

        vectorLayerRef.current = vectorLayer
        mapInstanceRef.current.addLayer(vectorLayer)
      }
    }, [regionsData, initialHighlight, activeRegion, indexData, activeType])

    useEffect(() => {
      if (mapInstanceRef.current && districtsData) {
        setDistricts(districtsData)
        if (districtsLayerRef.current) {
          mapInstanceRef.current.removeLayer(districtsLayerRef.current)
        }
        const vectorSource = new VectorSource({
          features: new GeoJSON({
            featureProjection: 'EPSG:3857',
          }).readFeatures(districtsData),
        })
        const vectorLayer = new VectorLayer({
          source: vectorSource,
          style: districtStyle,
        })
        districtsLayerRef.current = vectorLayer
        mapInstanceRef.current.addLayer(vectorLayer)
      }
    }, [districtsData, activeDistrict, districtsIndexData, activeType])

    useImperativeHandle(ref, () => ({
      zoomToRegion: (regionName) => {
        if (!mapInstanceRef.current || !vectorLayerRef.current) return
        const features = vectorLayerRef.current.getSource().getFeatures()
        const feature = features.find((f) => f.get('adm1_ru') === regionName)
        if (feature) {
          const geometry = feature.getGeometry()
          const extent = geometry.getExtent()
          mapInstanceRef.current.getView().fit(extent, {
            duration: 500,
            maxZoom: 10,
            padding: [40, 40, 40, 40],
          })
        }
      },
    }))

    return (
      <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
        <Box
          ref={mapRef}
          sx={{
            width: '100%',
            height: '100%',
            position: 'relative',
            inset: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            padding: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
          }}
        >
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
            Условные обозначения:
          </h4>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <div
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: 'rgba(204, 221, 255, 0.3)',
                border: '2px solid rgba(0, 82, 180, 1)',
                marginRight: '8px',
              }}
            />
            <span style={{ fontSize: '12px' }}>Области</span>
          </div>
          {/*<div>*/}
          {/*  <div*/}
          {/*    style={{*/}
          {/*      width: '100%',*/}
          {/*      height: '16px',*/}
          {/*      background: 'linear-gradient(to right, #fff, #80a179)',*/}
          {/*      borderRadius: '8px',*/}
          {/*      marginTop: '4px',*/}
          {/*    }}*/}
          {/*  />*/}
          {/*  <div*/}
          {/*    style={{*/}
          {/*      display: 'flex',*/}
          {/*      justifyContent: 'space-between',*/}
          {/*      fontSize: '10px',*/}
          {/*      marginTop: '4px',*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    <span>Слабый</span>*/}
          {/*    <span>Сильный</span>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </Box>
      </Box>
    )
  }
)

MapComponent.displayName = 'MapComponent'
