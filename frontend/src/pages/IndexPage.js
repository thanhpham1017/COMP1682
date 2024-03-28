import Post from "../Post";
import { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";


export default function IndexPage(){
    const [map, setMap] = useState(null);
    const positiontest = { lat: 21.012172376677967, lng: 105.80417109847609 };
    const mapOptions = {
    // Your map options here (center, zoom, etc.)
    zoom: 15,
    };
    useEffect(() => {
        const loader = new Loader({
          apiKey: "AIzaSyB2cDgXh6h261sP7lfl6cmC39Sw6_Us8vg", // Replace with your actual API key
        });
      
        loader.load({ libraries: ["marker"] }).then(() => {
            const google = window.google;
            const mapElement = document.getElementById("map");
      
            // Check if geolocation is supported
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                  };
                  setMap(
                    new google.maps.Map(mapElement, {
                      ...mapOptions,
                      center: userLocation,
                      mapId: "280b1ee7c20535a0",
                    })
                  );
                    const marker = new google.maps.marker.AdvancedMarkerElement({
                      map,
                      position: userLocation,
                      title: "Test Marker", // Set your desired title
                      content: {
                        header: <h3>Test Marker</h3>,
                      },
                    });
                },
                (error) => {
                  console.error("Error getting user location:", error);
                }
              );
            } else {
              console.error("Geolocation is not supported by this browser.");
            }
          });
        }, []);
        
    const [posts,setPosts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/post').then(reponse => {
            reponse.json().then(posts => {
                setPosts(posts);
            });
        });
    }, []);
    return(
        <div className="post-wrapper">
            <div id="map" style={{ width: "100%", height: "500px" }}></div>
            {posts.length > 0 && posts.map((post) => (
            <Post key={post.id} {...post} />
            ))}
        </div>
    );
}