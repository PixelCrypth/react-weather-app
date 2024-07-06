// Import react and react-bootstrap components and weather.css file
import React, { useState } from 'react';
import { Form, Button, Card, Container, Col, Image, Alert, Row } from 'react-bootstrap';
import './Weather.css';

// Import background images
import ImageRainSky from './Assets/Imgs/RainSky.png';
import ImageClearSky from './Assets/Imgs/ClearSky.png';
import ImageMistSky from './Assets/Imgs/MistSky.png';
// Weather icon image
import WeatherIcon from './Assets/Imgs/WeatherIcon.png';

const Weather = () => {
    // State variables
    const [location, setLocation] = useState('');
    const [weather, setWeather] = useState(null);
    const [backgroundStyle, setBackgroundStyle] = useState({ backgroundColor: '#343a40', height: '100vh' });
    const [error, setError] = useState(null);
    const [locationFound, setLocationFound] = useState(false);
    const [googleMapsLocation, setGoogleMapsLocation] = useState('');

    // Function to fetch weather data from OpenWeatherMap API
    const getWeather = async () => {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=28d58c8e6da4d444b259141503f0825f&units=metric`);
            if (!response.ok) {
                throw new Error('Location not found');
            }
            const data = await response.json();
            // Update state with weather data
            setWeather(data);
            // Update background style based on weather condition
            setBackgroundStyle(getBackgroundStyle(data.weather[0].main));
            // Clear any previous errors
            setError(null);
            // Set locationFound to true when location is successfully found
            setLocationFound(true);
            // Set Google Maps location for the link after successful fetch
            setGoogleMapsLocation(location);
        } catch (error) {
            // Handle location not found error
            setError('Location not found');
            // Clear weather data on error
            setWeather(null);
            // Set default background style on error
            setBackgroundStyle({ backgroundColor: '#343a40', height: '100vh' });
            // Ensure locationFound is false on error
            setLocationFound(false);
            // Clear Google Maps location on error
            setGoogleMapsLocation('');
        }
    };

    // Function to generate background style based on weather condition
    const getBackgroundStyle = (weatherCondition) => {
        switch (weatherCondition) {
            case 'Clear':
            case 'Clouds':
                return { backgroundImage: `url(${ImageClearSky})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', height: '100vh' };
            case 'Rain':
                return { backgroundImage: `url(${ImageRainSky})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', height: '100vh' };
            case 'Mist':
                return { backgroundImage: `url(${ImageMistSky})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', height: '100vh' };
            default:
                return { backgroundColor: '#343a40', height: '100vh' };
        }
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        // Call function to fetch weather data
        getWeather();
    };

    // Function to generate Google Maps link based on the found location
    const generateGoogleMapsLink = () => {
        if (weather) {
            return `https://www.google.com/maps/place/${googleMapsLocation}/`;
        }
        return '#';
    };

    // JSX structure
    return (
        <Container fluid className={`weather-container ${locationFound ? 'flex-container' : ''}`} style={backgroundStyle}>
            <Row className="justify-content-center align-items-center h-100">
                <Col xs={12} md={6}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="location">
                            <Form.Label className="text-light mt-5"><h1>Location</h1></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Type a province, city, or country name..."
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="bg-dark text-light"
                            />
                        </Form.Group>
                        {/* Warning alert */}
                        <Alert variant="warning" className="mt-2">
                            Warning: For accurate weather data, enter a city name (e.g., London, New York) rather than a broad region or country.
                        </Alert>
                        {/* Error alert */}
                        {error && (
                            <Alert variant="danger" className="mt-2">
                                {error}
                            </Alert>
                        )}
                        {/* Submit button */}
                        <Button variant="primary" type="submit" block>
                            Get Weather and location
                        </Button>
                    </Form>

                    {/* Weather card */}
                    {weather && (
                        <Card className="mt-3 bg-dark text-light weather-card">
                            <Card.Body>
                                <Card.Title>{weather.name}</Card.Title>
                                <Card.Text>Temperature: {weather.main.temp} °C</Card.Text>
                                <Card.Text>Condition: {weather.weather[0].description}</Card.Text>
                                <Card.Text>Humidity: {weather.main.humidity} %</Card.Text>
                                <Card.Text>Wind Speed: {weather.wind.speed} m/s</Card.Text>
                            </Card.Body>
                        </Card>
                    )}

                    {/* Google Maps card */}
                    {locationFound && (
                        <Card className="mt-3 bg-dark text-light weather-card">
                            <Card.Body>
                                <Card.Title>{googleMapsLocation} on Google Maps</Card.Title>
                                <Card.Text>Explore {googleMapsLocation} on Google Maps</Card.Text>
                                <Button variant="primary" href={generateGoogleMapsLink()} target="_blank">
                                    Open Google Maps
                                </Button>
                            </Card.Body>
                        </Card>
                    )}
                </Col>

                {/* Weather icon column */}
                {locationFound && (
                    <Col xs={6} md={4} className="mt-3 d-flex justify-content-center align-items-center">
                        <Image src={WeatherIcon} rounded fluid className="img-fluid" />
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default Weather;
