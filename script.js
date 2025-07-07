const CONFIG = {
    API_KEY: 'c5aba6c3444733871d2f540e63c32bd5',
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
    AIR_QUALITY_URL: 'https://api.openweathermap.org/data/2.5/air_pollution',
    UNITS: 'metric',
    LANGUAGE: 'pt_br',
    DEFAULT_CITY: 'São Paulo, BR'
};

const APP_STATE = {
    currentLocation: null,
    currentWeather: null,
    forecast: null,
    airQuality: null,
    settings: {
        temperatureUnit: 'celsius',
        windUnit: 'kmh',
        autoLocation: true
    },
    recentSearches: []
};

const DOM = {
    cityInput: document.getElementById('cityInput'),
    searchBtn: document.getElementById('searchBtn'),
    locationBtn: document.getElementById('locationBtn'),
    settingsBtn: document.getElementById('settingsBtn'),
    retryBtn: document.getElementById('retryBtn'),
    closeSettings: document.getElementById('closeSettings'),
    
    tempUnit: document.getElementById('tempUnit'),
    windUnit: document.getElementById('windUnit'),
    autoLocation: document.getElementById('autoLocation'),
    
    weatherCard: document.getElementById('weatherCard'),
    forecastContainer: document.getElementById('forecastContainer'),
    recentSearches: document.getElementById('recentSearches'),
    hourlyForecast: document.getElementById('hourlyForecast'),
    
    loading: document.getElementById('loading'),
    error: document.getElementById('error'),
    errorMessage: document.getElementById('errorMessage'),
    settingsModal: document.getElementById('settingsModal'),
    
    cityName: document.getElementById('cityName'),
    dateTime: document.getElementById('dateTime'),
    coordinates: document.getElementById('coordinates'),
    temperature: document.getElementById('temperature'),
    weatherIcon: document.getElementById('weatherIcon'),
    weatherDesc: document.getElementById('weatherDesc'),
    feelsLike: document.getElementById('feelsLike'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('windSpeed'),
    visibility: document.getElementById('visibility'),
    pressure: document.getElementById('pressure'),
    uvIndex: document.getElementById('uvIndex'),
    sunrise: document.getElementById('sunrise'),
    sunset: document.getElementById('sunset'),
    aqiValue: document.getElementById('aqiValue'),
    aqiLabel: document.getElementById('aqiLabel')
};

const WEATHER_ICONS = {
    '01d': 'fas fa-sun',
    '01n': 'fas fa-moon',
    '02d': 'fas fa-cloud-sun',
    '02n': 'fas fa-cloud-moon',
    '03d': 'fas fa-cloud',
    '03n': 'fas fa-cloud',
    '04d': 'fas fa-clouds',
    '04n': 'fas fa-clouds',
    '09d': 'fas fa-cloud-rain',
    '09n': 'fas fa-cloud-rain',
    '10d': 'fas fa-cloud-sun-rain',
    '10n': 'fas fa-cloud-moon-rain',
    '11d': 'fas fa-bolt',
    '11n': 'fas fa-bolt',
    '13d': 'fas fa-snowflake',
    '13n': 'fas fa-snowflake',
    '50d': 'fas fa-smog',
    '50n': 'fas fa-smog'
};

class WeatherApp {
    constructor() {
        this.init();
    }

    async init() {
        this.loadSettings();
        this.loadRecentSearches();
        this.setupEventListeners();
        this.setupSettingsModal();
        
        // Inicializar com localização automática se habilitada
        if (APP_STATE.settings.autoLocation) {
            await this.getCurrentLocation();
        } else {
            this.loadDefaultCity();
        }
    }

    setupEventListeners() {
        DOM.searchBtn.addEventListener('click', () => this.searchByCity());
        DOM.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchByCity();
        });

        DOM.locationBtn.addEventListener('click', () => this.getCurrentLocation());
        
        DOM.settingsBtn.addEventListener('click', () => this.openSettings());
        DOM.closeSettings.addEventListener('click', () => this.closeSettings());
        
        DOM.retryBtn.addEventListener('click', () => this.retryLastSearch());
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchForecastTab(e));
        });
    }

    setupSettingsModal() {
        DOM.tempUnit.value = APP_STATE.settings.temperatureUnit;
        DOM.windUnit.value = APP_STATE.settings.windUnit;
        DOM.autoLocation.checked = APP_STATE.settings.autoLocation;

        DOM.tempUnit.addEventListener('change', (e) => {
            APP_STATE.settings.temperatureUnit = e.target.value;
            this.saveSettings();
            this.updateDisplay();
        });

        DOM.windUnit.addEventListener('change', (e) => {
            APP_STATE.settings.windUnit = e.target.value;
            this.saveSettings();
            this.updateDisplay();
        });

        DOM.autoLocation.addEventListener('change', (e) => {
            APP_STATE.settings.autoLocation = e.target.checked;
            this.saveSettings();
        });
    }

    async getCurrentLocation() {
        if (!navigator.geolocation) {
            this.showError('Geolocalização não é suportada pelo seu navegador');
            return;
        }

        this.showLoading();
        this.hideError();

        try {
            const position = await this.getPosition();
            const { latitude, longitude } = position.coords;
            
            APP_STATE.currentLocation = { lat: latitude, lng: longitude };
            
            await this.getWeatherByCoords(latitude, longitude);
            this.addToRecentSearches('Minha Localização');
            
        } catch (error) {
            console.error('Erro na geolocalização:', error);
            this.showError('Não foi possível obter sua localização. Verifique as permissões.');
        }
    }

    getPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 
            });
        });
    }

    async searchByCity() {
        const city = DOM.cityInput.value.trim();
        
        if (!city) {
            this.showError('Por favor, digite o nome de uma cidade');
            return;
        }

        this.showLoading();
        this.hideError();

        try {
            await this.getWeatherByCity(city);
            this.addToRecentSearches(city);
            DOM.cityInput.value = '';
            
        } catch (error) {
            console.error('Erro ao buscar cidade:', error);
            this.showError('Cidade não encontrada. Verifique o nome e tente novamente.');
        }
    }

    async getWeatherByCity(city) {
        const [currentWeather, forecast, airQuality] = await Promise.all([
            this.fetchCurrentWeather(`q=${encodeURIComponent(city)}`),
            this.fetchForecast(`q=${encodeURIComponent(city)}`),
            this.fetchAirQuality(`q=${encodeURIComponent(city)}`)
        ]);

        this.updateWeatherData(currentWeather, forecast, airQuality);
    }

    async getWeatherByCoords(lat, lng) {
        const [currentWeather, forecast, airQuality] = await Promise.all([
            this.fetchCurrentWeather(`lat=${lat}&lon=${lng}`),
            this.fetchForecast(`lat=${lat}&lon=${lng}`),
            this.fetchAirQuality(`lat=${lat}&lon=${lng}`)
        ]);

        this.updateWeatherData(currentWeather, forecast, airQuality);
    }

    async fetchCurrentWeather(params) {
        const response = await fetch(
            `${CONFIG.BASE_URL}/weather?${params}&appid=${CONFIG.API_KEY}&units=${CONFIG.UNITS}&lang=${CONFIG.LANGUAGE}`
        );
        
        if (!response.ok) {
            throw new Error('Erro ao buscar dados do clima');
        }
        
        return await response.json();
    }

    async fetchForecast(params) {
        const response = await fetch(
            `${CONFIG.BASE_URL}/forecast?${params}&appid=${CONFIG.API_KEY}&units=${CONFIG.UNITS}&lang=${CONFIG.LANGUAGE}`
        );
        
        if (!response.ok) {
            throw new Error('Erro ao buscar previsão');
        }
        
        return await response.json();
    }

    async fetchAirQuality(params) {
        const response = await fetch(
            `${CONFIG.AIR_QUALITY_URL}?${params}&appid=${CONFIG.API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error('Erro ao buscar qualidade do ar');
        }
        
        return await response.json();
    }

    updateWeatherData(currentWeather, forecast, airQuality) {
        APP_STATE.currentWeather = currentWeather;
        APP_STATE.forecast = forecast;
        APP_STATE.airQuality = airQuality;

        this.displayCurrentWeather();
        this.displayForecast();
        this.displayAirQuality();
        this.displaySunInfo();
        this.displayHourlyForecast();
        
        this.hideLoading();
        this.showWeatherData();
    }

    displayCurrentWeather() {
        const data = APP_STATE.currentWeather;
        
        DOM.cityName.textContent = `${data.name}, ${data.sys.country}`;
        DOM.dateTime.textContent = this.formatDateTime(data.dt);
        DOM.coordinates.textContent = `${data.coord.lat.toFixed(2)}°, ${data.coord.lon.toFixed(2)}°`;
        
        const temp = this.convertTemperature(data.main.temp);
        DOM.temperature.textContent = Math.round(temp);
        
        DOM.weatherDesc.textContent = data.weather[0].description;
        DOM.weatherIcon.className = WEATHER_ICONS[data.weather[0].icon] || 'fas fa-question';
        
        const feelsLike = this.convertTemperature(data.main.feels_like);
        DOM.feelsLike.textContent = `${Math.round(feelsLike)}°${this.getTempSymbol()}`;
        
        DOM.humidity.textContent = `${data.main.humidity}%`;
        
        const windSpeed = this.convertWindSpeed(data.wind.speed);
        DOM.windSpeed.textContent = `${Math.round(windSpeed)} ${this.getWindUnit()}`;
        
        DOM.visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
        DOM.pressure.textContent = `${data.main.pressure} hPa`;
    }

    displayForecast() {
        DOM.forecastContainer.innerHTML = '';
        
        const dailyData = this.groupForecastByDay(APP_STATE.forecast.list);
        const next7Days = Object.values(dailyData).slice(0, 7);
        
        next7Days.forEach(dayData => {
            const dayCard = this.createForecastDayCard(dayData);
            DOM.forecastContainer.appendChild(dayCard);
        });
    }

    displayAirQuality() {
        if (!APP_STATE.airQuality) return;
        
        const aqi = APP_STATE.airQuality.list[0].main.aqi;
        const aqiInfo = this.getAQIInfo(aqi);
        
        DOM.aqiValue.textContent = aqi;
        DOM.aqiLabel.textContent = aqiInfo.label;
        DOM.aqiValue.style.color = aqiInfo.color;
    }

    displaySunInfo() {
        const data = APP_STATE.currentWeather;
        
        DOM.sunrise.textContent = this.formatTime(data.sys.sunrise);
        DOM.sunset.textContent = this.formatTime(data.sys.sunset);
    }

    displayHourlyForecast() {
        DOM.hourlyForecast.innerHTML = '';
        
        const hourlyData = APP_STATE.forecast.list.slice(0, 24);
        
        hourlyData.forEach(hour => {
            const hourItem = this.createHourlyItem(hour);
            DOM.hourlyForecast.appendChild(hourItem);
        });
    }

    groupForecastByDay(forecastList) {
        const dailyData = {};
        
        forecastList.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dayKey = date.toDateString();
            
            if (!dailyData[dayKey]) {
                dailyData[dayKey] = {
                    date: date,
                    temps: [],
                    icons: [],
                    descriptions: []
                };
            }
            
            dailyData[dayKey].temps.push(item.main.temp);
            dailyData[dayKey].icons.push(item.weather[0].icon);
            dailyData[dayKey].descriptions.push(item.weather[0].description);
        });
        
        return dailyData;
    }

    createForecastDayCard(dayData) {
        const card = document.createElement('div');
        card.className = 'forecast-day';
        
        const avgTemp = Math.round(dayData.temps.reduce((a, b) => a + b, 0) / dayData.temps.length);
        const convertedTemp = this.convertTemperature(avgTemp);
        const mostFrequentIcon = this.getMostFrequent(dayData.icons);
        const dayName = this.formatDayName(dayData.date);
        
        card.innerHTML = `
            <div class="day">${dayName}</div>
            <div class="icon">
                <i class="${WEATHER_ICONS[mostFrequentIcon] || 'fas fa-question'}"></i>
            </div>
            <div class="temp">${Math.round(convertedTemp)}°${this.getTempSymbol()}</div>
        `;
        
        return card;
    }

    createHourlyItem(hour) {
        const item = document.createElement('div');
        item.className = 'hourly-item';
        
        const time = new Date(hour.dt * 1000);
        const temp = this.convertTemperature(hour.main.temp);
        
        item.innerHTML = `
            <div class="time">${this.formatHour(time)}</div>
            <div class="icon">
                <i class="${WEATHER_ICONS[hour.weather[0].icon] || 'fas fa-question'}"></i>
            </div>
            <div class="temp">${Math.round(temp)}°${this.getTempSymbol()}</div>
        `;
        
        return item;
    }

    convertTemperature(temp) {
        if (APP_STATE.settings.temperatureUnit === 'fahrenheit') {
            return (temp * 9/5) + 32;
        }
        return temp;
    }

    convertWindSpeed(speed) {
        if (APP_STATE.settings.windUnit === 'mph') {
            return speed * 2.237; // m/s para mph
        }
        return speed * 3.6; // m/s para km/h
    }

    getTempSymbol() {
        return APP_STATE.settings.temperatureUnit === 'fahrenheit' ? 'F' : 'C';
    }

    getWindUnit() {
        return APP_STATE.settings.windUnit === 'mph' ? 'mph' : 'km/h';
    }

    formatDateTime(timestamp) {
        const date = new Date(timestamp * 1000);
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('pt-BR', options);
    }

    formatTime(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatHour(date) {
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatDayName(date) {
        const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        return days[date.getDay()];
    }

    getMostFrequent(arr) {
        const frequency = {};
        let maxFreq = 0;
        let mostFrequent = arr[0];
        
        arr.forEach(item => {
            frequency[item] = (frequency[item] || 0) + 1;
            if (frequency[item] > maxFreq) {
                maxFreq = frequency[item];
                mostFrequent = item;
            }
        });
        
        return mostFrequent;
    }

    getAQIInfo(aqi) {
        const aqiLevels = {
            1: { label: 'Boa', color: '#10b981' },
            2: { label: 'Moderada', color: '#f59e0b' },
            3: { label: 'Ruim', color: '#f97316' },
            4: { label: 'Muito Ruim', color: '#ef4444' },
            5: { label: 'Perigosa', color: '#7c2d12' }
        };
        
        return aqiLevels[aqi] || { label: 'Desconhecido', color: '#6b7280' };
    }

    addToRecentSearches(city) {
        const searches = APP_STATE.recentSearches.filter(s => s !== city);
        searches.unshift(city);
        APP_STATE.recentSearches = searches.slice(0, 5);
        this.saveRecentSearches();
        this.displayRecentSearches();
    }

    displayRecentSearches() {
        DOM.recentSearches.innerHTML = '';
        
        APP_STATE.recentSearches.forEach(city => {
            const searchItem = document.createElement('div');
            searchItem.className = 'recent-search';
            searchItem.textContent = city;
            searchItem.addEventListener('click', () => {
                DOM.cityInput.value = city;
                this.searchByCity();
            });
            DOM.recentSearches.appendChild(searchItem);
        });
    }

    loadSettings() {
        const saved = localStorage.getItem('weatherSettings');
        if (saved) {
            APP_STATE.settings = { ...APP_STATE.settings, ...JSON.parse(saved) };
        }
    }

    saveSettings() {
        localStorage.setItem('weatherSettings', JSON.stringify(APP_STATE.settings));
    }

    loadRecentSearches() {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            APP_STATE.recentSearches = JSON.parse(saved);
        }
    }

    saveRecentSearches() {
        localStorage.setItem('recentSearches', JSON.stringify(APP_STATE.recentSearches));
    }

    showLoading() {
        DOM.loading.style.display = 'flex';
    }

    hideLoading() {
        DOM.loading.style.display = 'none';
    }

    showError(message) {
        DOM.errorMessage.textContent = message;
        DOM.error.style.display = 'flex';
        this.hideLoading();
    }

    hideError() {
        DOM.error.style.display = 'none';
    }

    showWeatherData() {
        DOM.weatherCard.style.display = 'block';
    }

    openSettings() {
        DOM.settingsModal.style.display = 'flex';
    }

    closeSettings() {
        DOM.settingsModal.style.display = 'none';
    }

    switchForecastTab(e) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
    }

    retryLastSearch() {
        this.hideError();
        if (APP_STATE.currentLocation) {
            this.getCurrentLocation();
        } else {
            this.searchByCity();
        }
    }

    loadDefaultCity() {
        DOM.cityInput.value = CONFIG.DEFAULT_CITY;
        this.searchByCity();
    }

    updateDisplay() {
        if (APP_STATE.currentWeather) {
            this.displayCurrentWeather();
            this.displayForecast();
            this.displayHourlyForecast();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});

window.addEventListener('click', (e) => {
    if (e.target === DOM.settingsModal) {
        DOM.settingsModal.style.display = 'none';
    }
}); 
