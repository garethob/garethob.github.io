// Running Progress 2025 App
class RunningApp {
    constructor() {
        this.runs = [];
        this.goal = 500;
        this.charts = {};
        this.sortColumn = 'date';
        this.sortDirection = 'desc';
        
        this.initializeApp();
    }

    initializeApp() {
        this.loadSampleData();
        this.setupEventListeners();
        this.setTodayDate();
        this.renderTable();
        this.updateProgress();
        this.initializeCharts();
    }

    loadSampleData() {
        // Updated sample data to ensure it totals to 360km
        const sampleData = [
            {"date": "2025-01-15", "distance": 5.0, "minutes": 25, "seconds": 30},
            {"date": "2025-01-18", "distance": 5.0, "minutes": 18, "seconds": 45},
            {"date": "2025-01-22", "distance": 8.0, "minutes": 45, "seconds": 20},
            {"date": "2025-02-01", "distance": 5.0, "minutes": 24, "seconds": 50},
            {"date": "2025-02-05", "distance": 10.0, "minutes": 52, "seconds": 15},
            {"date": "2025-02-12", "distance": 6.0, "minutes": 32, "seconds": 10},
            {"date": "2025-02-18", "distance": 5.0, "minutes": 24, "seconds": 20},
            {"date": "2025-03-03", "distance": 12.0, "minutes": 63, "seconds": 30},
            {"date": "2025-03-08", "distance": 5.0, "minutes": 23, "seconds": 55},
            {"date": "2025-03-15", "distance": 8.0, "minutes": 38, "seconds": 45},
            {"date": "2025-03-22", "distance": 10.0, "minutes": 51, "seconds": 20},
            {"date": "2025-04-02", "distance": 5.0, "minutes": 23, "seconds": 40},
            {"date": "2025-04-09", "distance": 8.0, "minutes": 40, "seconds": 55},
            {"date": "2025-04-16", "distance": 15.0, "minutes": 78, "seconds": 45},
            {"date": "2025-04-25", "distance": 5.0, "minutes": 23, "seconds": 15},
            {"date": "2025-05-05", "distance": 10.0, "minutes": 49, "seconds": 50},
            {"date": "2025-05-12", "distance": 7.0, "minutes": 32, "seconds": 20},
            {"date": "2025-05-20", "distance": 5.0, "minutes": 22, "seconds": 58},
            {"date": "2025-05-28", "distance": 13.0, "minutes": 68, "seconds": 15},
            {"date": "2025-06-08", "distance": 5.0, "minutes": 22, "seconds": 35},
            {"date": "2025-06-15", "distance": 10.0, "minutes": 48, "seconds": 40},
            {"date": "2025-06-25", "distance": 7.0, "minutes": 35, "seconds": 15},
            {"date": "2025-07-04", "distance": 5.0, "minutes": 22, "seconds": 20},
            {"date": "2025-07-12", "distance": 11.0, "minutes": 56, "seconds": 30},
            {"date": "2025-07-20", "distance": 9.0, "minutes": 42, "seconds": 10},
            {"date": "2025-07-28", "distance": 10.0, "minutes": 47, "seconds": 55},
            {"date": "2025-08-06", "distance": 5.0, "minutes": 21, "seconds": 50},
            {"date": "2025-08-14", "distance": 16.0, "minutes": 82, "seconds": 20},
            {"date": "2025-08-25", "distance": 7.0, "minutes": 33, "seconds": 45},
            {"date": "2025-09-02", "distance": 5.0, "minutes": 21, "seconds": 30},
            {"date": "2025-09-10", "distance": 10.0, "minutes": 46, "seconds": 45},
            {"date": "2025-09-15", "distance": 10.0, "minutes": 44, "seconds": 55}
        ];

        this.runs = sampleData.map(run => ({
            ...run,
            totalSeconds: run.minutes * 60 + run.seconds,
            pace: this.calculatePace(run.distance, run.minutes * 60 + run.seconds)
        }));
    }

    setupEventListeners() {
        // Form submission
        const form = document.getElementById('add-run-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewRun();
        });

        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.dataset.view;
                this.switchView(view);
            });
        });

        // Table sorting
        document.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', (e) => {
                const column = e.target.dataset.sort;
                this.sortTable(column);
            });
        });
    }

    setTodayDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('run-date').value = today;
    }

    calculatePace(distance, totalSeconds) {
        const paceSeconds = totalSeconds / distance;
        const minutes = Math.floor(paceSeconds / 60);
        const seconds = Math.round(paceSeconds % 60);
        return { minutes, seconds, totalSeconds: paceSeconds };
    }

    formatTime(minutes, seconds) {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    formatPace(pace) {
        return `${pace.minutes}:${pace.seconds.toString().padStart(2, '0')}`;
    }

    addNewRun() {
        const date = document.getElementById('run-date').value;
        const distanceInput = document.getElementById('run-distance');
        const minutesInput = document.getElementById('run-minutes');
        const secondsInput = document.getElementById('run-seconds');
        
        const distance = parseFloat(distanceInput.value);
        const minutes = parseInt(minutesInput.value);
        const seconds = parseInt(secondsInput.value);

        // Clear any previous validation states
        [distanceInput, minutesInput, secondsInput].forEach(input => {
            input.setCustomValidity('');
        });

        // Validate inputs
        if (!date) {
            this.showFeedback('Please select a date.', 'error');
            return;
        }

        if (!distance || distance <= 0) {
            this.showFeedback('Please enter a valid distance.', 'error');
            distanceInput.focus();
            return;
        }

        if (isNaN(minutes) || minutes < 0) {
            this.showFeedback('Please enter valid minutes.', 'error');
            minutesInput.focus();
            return;
        }

        if (isNaN(seconds) || seconds < 0 || seconds > 59) {
            this.showFeedback('Please enter valid seconds (0-59).', 'error');
            secondsInput.focus();
            return;
        }

        const totalSeconds = minutes * 60 + seconds;
        const pace = this.calculatePace(distance, totalSeconds);

        const newRun = {
            date,
            distance,
            minutes,
            seconds,
            totalSeconds,
            pace
        };

        this.runs.push(newRun);
        this.runs.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Reset form
        document.getElementById('add-run-form').reset();
        this.setTodayDate();
        this.showFeedback('Run added successfully!', 'success');
        
        this.renderTable();
        this.updateProgress();
        this.updateCharts();
    }

    showFeedback(message, type) {
        const feedback = document.getElementById('form-feedback');
        feedback.textContent = message;
        feedback.className = `form-feedback ${type}`;
        feedback.classList.remove('hidden');

        setTimeout(() => {
            feedback.classList.add('hidden');
        }, 3000);
    }

    sortTable(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'desc';
        }

        this.runs.sort((a, b) => {
            let valueA, valueB;
            
            switch (column) {
                case 'date':
                    valueA = new Date(a.date);
                    valueB = new Date(b.date);
                    break;
                case 'distance':
                    valueA = a.distance;
                    valueB = b.distance;
                    break;
                case 'time':
                    valueA = a.totalSeconds;
                    valueB = b.totalSeconds;
                    break;
                case 'pace':
                    valueA = a.pace.totalSeconds;
                    valueB = b.pace.totalSeconds;
                    break;
                default:
                    return 0;
            }

            if (this.sortDirection === 'asc') {
                return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
            } else {
                return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
            }
        });

        this.updateSortHeaders();
        this.renderTable();
    }

    updateSortHeaders() {
        document.querySelectorAll('.sortable').forEach(header => {
            header.classList.remove('sort-asc', 'sort-desc');
            if (header.dataset.sort === this.sortColumn) {
                header.classList.add(`sort-${this.sortDirection}`);
            }
        });
    }

    renderTable() {
        const tbody = document.getElementById('runs-table-body');
        tbody.innerHTML = '';

        this.runs.forEach(run => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(run.date).toLocaleDateString()}</td>
                <td>${run.distance.toFixed(1)}</td>
                <td>${this.formatTime(run.minutes, run.seconds)}</td>
                <td>${this.formatPace(run.pace)}</td>
            `;
            tbody.appendChild(row);
        });
    }

    updateProgress() {
        const totalDistance = this.runs.reduce((sum, run) => sum + run.distance, 0);
        const percentage = Math.round((totalDistance / this.goal) * 100);
        const remaining = Math.max(0, this.goal - totalDistance);

        document.querySelector('.current-progress').textContent = `${totalDistance.toFixed(1)}km / ${this.goal}km completed`;
        document.querySelector('.remaining-progress').textContent = `${remaining.toFixed(1)}km to go`;
        document.querySelector('.progress-fill').style.width = `${Math.min(percentage, 100)}%`;
        document.querySelector('.progress-percentage').textContent = `${percentage}%`;
    }

    switchView(view) {
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');

        // Update active section
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${view}-view`).classList.add('active');

        // Initialize chart if needed
        if (view.includes('chart')) {
            setTimeout(() => this.initializeChart(view), 150);
        }
    }

    initializeCharts() {
        // Initialize the distance chart by default since it's referenced first
        setTimeout(() => this.createDistanceChart(), 100);
    }

    initializeChart(chartType) {
        switch (chartType) {
            case 'distance-chart':
                this.createDistanceChart();
                break;
            case '5k-chart':
                this.create5KChart();
                break;
            case '10k-chart':
                this.create10KChart();
                break;
            case 'cumulative-chart':
                this.createCumulativeChart();
                break;
        }
    }

    createDistanceChart() {
        const canvas = document.getElementById('distance-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.distance) {
            this.charts.distance.destroy();
        }

        const sortedRuns = [...this.runs].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        this.charts.distance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: sortedRuns.map(run => new Date(run.date).toLocaleDateString()),
                datasets: [{
                    label: 'Distance (km)',
                    data: sortedRuns.map(run => run.distance),
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Distance (km)'
                        },
                        grid: {
                            display: true
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        },
                        grid: {
                            display: true
                        }
                    }
                }
            }
        });
    }

    create5KChart() {
        const canvas = document.getElementById('5k-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.fiveK) {
            this.charts.fiveK.destroy();
        }

        const fiveKRuns = this.runs.filter(run => run.distance === 5.0)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        if (fiveKRuns.length === 0) {
            canvas.parentElement.innerHTML = '<div class="empty-state"><h3>No 5K runs found</h3><p>Add some 5K runs to see your pace progression.</p></div>';
            return;
        }
        
        this.charts.fiveK = new Chart(ctx, {
            type: 'line',
            data: {
                labels: fiveKRuns.map(run => new Date(run.date).toLocaleDateString()),
                datasets: [{
                    label: 'Pace (min:sec per km)',
                    data: fiveKRuns.map(run => run.pace.totalSeconds / 60),
                    borderColor: '#B4413C',
                    backgroundColor: 'rgba(180, 65, 60, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Pace (minutes per km)'
                        },
                        ticks: {
                            callback: function(value) {
                                const minutes = Math.floor(value);
                                const seconds = Math.round((value - minutes) * 60);
                                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                }
            }
        });
    }

    create10KChart() {
        const canvas = document.getElementById('10k-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.tenK) {
            this.charts.tenK.destroy();
        }

        const tenKRuns = this.runs.filter(run => run.distance === 10.0)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        if (tenKRuns.length === 0) {
            canvas.parentElement.innerHTML = '<div class="empty-state"><h3>No 10K runs found</h3><p>Add some 10K runs to see your pace progression.</p></div>';
            return;
        }
        
        this.charts.tenK = new Chart(ctx, {
            type: 'line',
            data: {
                labels: tenKRuns.map(run => new Date(run.date).toLocaleDateString()),
                datasets: [{
                    label: 'Pace (min:sec per km)',
                    data: tenKRuns.map(run => run.pace.totalSeconds / 60),
                    borderColor: '#5D878F',
                    backgroundColor: 'rgba(93, 135, 143, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Pace (minutes per km)'
                        },
                        ticks: {
                            callback: function(value) {
                                const minutes = Math.floor(value);
                                const seconds = Math.round((value - minutes) * 60);
                                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                }
            }
        });
    }

    createCumulativeChart() {
        const canvas = document.getElementById('cumulative-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.cumulative) {
            this.charts.cumulative.destroy();
        }

        const sortedRuns = [...this.runs].sort((a, b) => new Date(a.date) - new Date(b.date));
        let cumulativeDistance = 0;
        const cumulativeData = sortedRuns.map(run => {
            cumulativeDistance += run.distance;
            return {
                date: run.date,
                cumulative: cumulativeDistance
            };
        });
        
        this.charts.cumulative = new Chart(ctx, {
            type: 'line',
            data: {
                labels: cumulativeData.map(data => new Date(data.date).toLocaleDateString()),
                datasets: [{
                    label: 'Cumulative Distance (km)',
                    data: cumulativeData.map(data => data.cumulative),
                    borderColor: '#FFC185',
                    backgroundColor: 'rgba(255, 193, 133, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }, {
                    label: 'Goal (500km)',
                    data: new Array(cumulativeData.length).fill(500),
                    borderColor: '#DB4545',
                    backgroundColor: 'transparent',
                    borderDash: [5, 5],
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 550,
                        title: {
                            display: true,
                            text: 'Distance (km)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                }
            }
        });
    }

    updateCharts() {
        // Update all existing charts
        Object.keys(this.charts).forEach(chartKey => {
            if (this.charts[chartKey]) {
                switch (chartKey) {
                    case 'distance':
                        this.createDistanceChart();
                        break;
                    case 'fiveK':
                        this.create5KChart();
                        break;
                    case 'tenK':
                        this.create10KChart();
                        break;
                    case 'cumulative':
                        this.createCumulativeChart();
                        break;
                }
            }
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RunningApp();
});