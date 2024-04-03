import Post from "../Post";
import { useEffect, useState,useContext } from "react";
import MapGL,{Marker, Popup} from 'react-map-gl';
import {UserContext} from "./UserContext";
// import axios from "axios";
import { FaMapMarker,FaStar  } from 'react-icons/fa';

export default function IndexPage(){
    const [posts,setPosts] = useState([]);
    const [pins, setPins] = useState([]);
    const [currentPlaceId, setCurrentPlaceId] = useState(null);
    const [selectedPin, setSelectedPin] = useState(null);
    const [newPlace, setNewPlace] = useState(null);
    const [title, setTitle] = useState(null);
    const [desc, setDesc] = useState(null);
    const [price, setPrice] = useState(0);
    const [star, setStar] = useState(0);
    const {userInfo } = useContext(UserContext);
    const [viewport, setViewport] = useState({
      latitude: 21.03,    // Vĩ độ của Hà Nội
      longitude: 105.85, // Kinh độ của Hà Nội
      zoom: 10
    });

    useEffect(() => {
        fetch('http://localhost:4000/post').then(reponse => {
            reponse.json().then(posts => {
                setPosts(posts);
            });
        });
    }, []);

    useEffect(() => {
      console.log("pins:", pins);
      console.log("currentPlaceId:", currentPlaceId);
      const getPins = async () => {
        try {    
          const response = await fetch("http://localhost:4000/pins"); // Đổi lại địa chỉ máy chủ và tên tuyến đường cần truy cập
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const pinsData = await response.json();
          setPins(pinsData);
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
        }
      };
      getPins();
    }, []);
    const handleMarkerClick = (id,lat,long) => {
        console.log("Marker clicked with id:", id);
        setSelectedPin(pins.find(pin => pin._id === id));
        setCurrentPlaceId(id);
        setViewport({ ...viewport, latitude: lat, longitude: long });
    }

    const handleAddClick = (e) => {
      const long = e.lngLat.lng;
      const lat = e.lngLat.lat;
      setNewPlace({
        lat,
        long,
      });
    }
    const currentUser = userInfo?.username;

    const handleSubmit = async (e) => {
      e.preventDefault();
      const newPin = {
        username: currentUser,
        title,
        desc,
        price,
        rating: star,
        lat: newPlace.lat,
        long: newPlace.long,
      };
    
      try {
        const response = await fetch("http://localhost:4000/pinCreate", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPin),
        });
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        const pinData = await response.json();
        setPins([...pins, pinData]);
        setNewPlace(null);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    }; 
    return(
      <div>
          <MapGL
            mapboxAccessToken={process.env.REACT_APP_MAPBOX}
            initialViewState={{
            ...viewport
            }}
            style={{width: 1440, height: 700}}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            onDblClick={handleAddClick}
            transitionDuration = "200"
          >
            {pins.map(p => (
              <>
                <Marker 
                  longitude={p.long} 
                  latitude={p.lat} 
                  anchor="bottom" 
                >
                  <FaMapMarker 
                    style={{
                      fontSize: 300 / viewport.zoom, // Tính toán kích thước dựa trên zoom
                      color:"red",
                      cursor: "pointer",
                    }}
                    onClick={() => handleMarkerClick(p._id,p.lat,p.long) }
                  />

                </Marker>

                  <Popup 
                    key={currentPlaceId}
                    longitude={selectedPin &&selectedPin.long} 
                    latitude={selectedPin &&selectedPin.lat}
                    anchor="left"
                    onClose={() => setCurrentPlaceId(null)}
                  >
                    {console.log("Popup is rendered")} {/* In ra console để kiểm tra xem Popup có được render hay không */}
                    <div className="card">
                      <label>{selectedPin && selectedPin.title}</label><br />
                      <label>{selectedPin && selectedPin.desc}</label><br />
                      <label>{selectedPin && selectedPin.price}</label><br />
                      <div>
                          <a href="link-to-youtube">Youtube</a> // <a href="link-to-instagram">Instagram</a> // <a href="link-to-tiktok">Tiktok</a>
                      </div>
                      <div className="ratings">
                          {Array(selectedPin && selectedPin.rating).fill(<FaStar className="star" />)}
                          <label>{selectedPin && selectedPin.rating}</label>
                      </div>
                      <label>{selectedPin && selectedPin.username}</label><br />
                  </div>
                  </Popup>
              </>
            ))}
            {newPlace && 
              <Popup 
                    longitude={newPlace.long} 
                    latitude={newPlace.lat}
                    anchor="left"
                    onClose={() => setNewPlace(null)}
                  >
                  <form onSubmit={handleSubmit}>
                    <div className="formCard">
                      <label>Name:</label><br />
                      <input 
                        className="formInput" 
                        placeholder="Enter name" 
                        onChange={(e) => setTitle(e.target.value)}
                        /><br />
                      <label>Review:</label><br />
                      <textarea className="formInput" 
                        placeholder="Say something about this place"
                        onChange={(e) => setDesc(e.target.value)}
                      ></textarea><br />
                      <label>Price:</label><br />
                      <input 
                        className="formInput" 
                        type="number" 
                        placeholder="Price" 
                        onChange={(e) => setPrice(e.target.value)}
                        /><br />
                      <div>
                        <a href="link-to-youtube">Youtube</a> // <a href="link-to-instagram">Instagram</a> // <a href="link-to-tiktok">Tiktok</a>
                      </div>
                      <label>Rating:</label><br />
                      <select className="formInput" onChange={(e) => setStar(e.target.value)}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select><br />
                      <button className="formSubmitButton" type="submit">Add Pin</button><br />
                    </div>
                  </form>
              </Popup>      
            } 
        </MapGL>
        <div className="post-wrapper">
            <div id="map"></div>
            {posts.length > 0 && posts.map((post) => (
              <Post key={post.id} {...post} />
            ))}
        </div>
      </div>
    );
}
