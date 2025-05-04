const toggleBtn = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');

function toggleSidebar(){
sidebar.classList.toggle('close');
toggleBtn.classList.toggle('rotate');

Array.from(sidebar.getElementsByClassName('show')).forEach(ul =>{
    ul.classList.remove('show');
    ul.previousElementSibling.classList.remove('rotate');
})
}

function toggleSubMenu(myButton){
myButton.nextElementSibling.classList.toggle('show');
myButton.classList.toggle('rotate');
if(sidebar.classList.contains('close')){
    sidebar.classList.toggle('close');
    sidebar.classList.toggle('rotate');
}
}

// chart 
// chart 

let chart;
function initChart() {
    const options = {
        series: [{
            data: generateCandleData()
        }],
        chart: {
            type: 'candlestick',
            height: 250,
            background: 'transparent',
            foreColor: getComputedStyle(document.body).getPropertyValue('--text-color'),
            toolbar: {
                show: true,
                tools: {
                    download: false,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                }
            }
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: getComputedStyle(document.body).getPropertyValue('--positive-color'),
                    downward: getComputedStyle(document.body).getPropertyValue('--negative-color')
                }
            }
        },
        xaxis: {
            type: 'datetime'
        },
        yaxis: {
            tooltip: {
                enabled: true
            }
        },
        grid: {
            borderColor: getComputedStyle(document.body).getPropertyValue('--border-color')
        }
    };

    chart = new ApexCharts(document.querySelector("#chart1"), options);
    chart.render();
}



// random data genrator
// random data genrator

function generateCandleData() {
  const data = [];
  let basePrice = 2800 + Math.random() * 100;
  
  for (let i = 0; i < 30; i++) {
      const open = basePrice;
      const close = open + (Math.random() * 20 - 10);
      const high = Math.max(open, close) + Math.random() * 10;
      const low = Math.min(open, close) - Math.random() * 10;
      
      data.push({
          x: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000),
          y: [open.toFixed(2), high.toFixed(2), low.toFixed(2), close.toFixed(2)]
      });
      
      basePrice = close;
  }
  
  return data;
}


// chart updater when mode changes
// chart updater when mode changes

function updateChartTheme() {
  if (!chart) return;
  
  chart.updateOptions({
      chart: {
          foreColor: getComputedStyle(document.body).getPropertyValue('--text-color')
      },
      plotOptions: {
          candlestick: {
              colors: {
                  upward: getComputedStyle(document.body).getPropertyValue('--positive-color'),
                  downward: getComputedStyle(document.body).getPropertyValue('--negative-color')
              }
          }
      },
      grid: {
          borderColor: getComputedStyle(document.body).getPropertyValue('--border-color')
      }
  });
}


// Style selector functionality
// Style selector functionality

document.getElementById('styleSelector').addEventListener('change', function() {
  document.body.className = this.value;
  updateVisibility();
  updateChartTheme();
});


function updateVisibility() {
  const isMotilal = document.body.classList.contains('motilal');

  document.querySelector('.zerodha-content').style.display = isMotilal ? 'none' : 'grid';
  
  const motilalContent = document.querySelector('.motilal-content');
  if (motilalContent) {
      motilalContent.style.display = isMotilal ? 'grid' : 'none';
  }
}



// Dark/light mode toggle
// Dark/light mode toggle

document.getElementById('themeToggle').addEventListener('click', function() {
  document.body.classList.toggle('dark-mode');
  
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark);

  updateChartTheme();
});

if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
  }



// Motilal view functionality
// Motilal view functionality

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {

      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      const tabId = tab.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
  });
});




// Watchlist item handler
// Watchlist item handler

document.querySelectorAll('.watchlist-item').forEach(item => {
  item.addEventListener('click', function() {
      
      document.querySelectorAll('.watchlist-item').forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      
      const symbol = this.getAttribute('data-symbol');
      document.querySelector('.zerodha-content .card-title').textContent = `${symbol} - 1D`;
      document.getElementById('orderSymbol').value = symbol;
      
      updateChartData();
  });
});

 

// chart updater with new data
// chart updater with new data

function updateChartData() {
  if (!chart) return;
  const newData = generateCandleData();
  chart.updateSeries([{
      data: newData
  }]);
}



// live price updates
// live price updates

function updatePrices() {
  const changes = document.querySelectorAll('.change');
  changes.forEach(change => {
      if (change.classList.contains('positive')) {
          
          const value = (Math.random() * 0.5 + 0.1).toFixed(2);
          change.textContent = `+${value}%`;
          
          const priceElement = change.parentElement.querySelector('.price');
          if (priceElement) {
              const currentPrice = parseFloat(priceElement.textContent.replace('₹', '').replace(',', ''));
              const newPrice = currentPrice * (1 + parseFloat(value)/100);
              priceElement.textContent = `₹${newPrice.toFixed(2)}`;
          }
      } else if (change.classList.contains('negative')) {
          
          const value = (Math.random() * 0.5 + 0.1).toFixed(2);
          change.textContent = `-${value}%`;
          
          const priceElement = change.parentElement.querySelector('.price');
          if (priceElement) {
              const currentPrice = parseFloat(priceElement.textContent.replace('₹', '').replace(',', ''));
              const newPrice = currentPrice * (1 - parseFloat(value)/100);
              priceElement.textContent = `₹${newPrice.toFixed(2)}`;
          }
      }
  });
  
  if (Math.random() > 0.7) {
      updateChartData();
  }
  
  setTimeout(updatePrices, 3000);
}

        

// Initialize the dashboard
// Initialize the dashboard

document.addEventListener('DOMContentLoaded', function() {
  initChart();
  updatePrices();
  updateVisibility();
});
        

const MenuToggle = document.getElementById('mobileMenuToggle');
const sidebar1 = document.getElementById('sidebar');

let isSidebarOpen = true;

function toggleSidebar() {
    const isMobile = window.innerWidth <= 992;
    
    if (isMobile) {
        sidebar1.classList.toggle('show');
        isSidebarOpen = sidebar1.classList.contains('show');
    } else {
        sidebar1.classList.toggle('close');
        isSidebarOpen = !sidebar1.classList.contains('close');
    }
    
    toggleBtn.classList.toggle('rotate');

    closeAllSubMenus();
}

function closeAllSubMenus() {
    Array.from(sidebar1.getElementsByClassName('show')).forEach(ul => {
        ul.classList.remove('show');
        ul.previousElementSibling.classList.remove('rotate');
    });
}

function handleResize() {
    const isMobile = window.innerWidth <= 992;
    
    if (isMobile) {
        if (!sidebar1.classList.contains('show') && isSidebarOpen) {
            sidebar1.classList.add('show');
        }
        sidebar1.classList.remove('close');
    } else {
        sidebar1.classList.remove('show');
        if (isSidebarOpen) {
            sidebar1.classList.remove('close');
        } else {
            sidebar1.classList.add('close');
        }
    }
}

handleResize();

window.addEventListener('resize', handleResize);

document.addEventListener('click', function(event) {
    const isMobile = window.innerWidth <= 992;
    const clickedInsideSidebar = sidebar1.contains(event.target);
    const clickedToggleBtn = event.target === MenuToggle || MenuToggle.contains(event.target);
    
    if (isMobile && !clickedInsideSidebar && !clickedToggleBtn) {
        sidebar1.classList.remove('show');
        isSidebarOpen = false;
    }
});

MenuToggle.addEventListener('click', function(event) {
    event.stopPropagation();
    toggleSidebar();
});


const logoElement = document.getElementById('logo');

// document.getElementById('styleSelector').addEventListener('change', function() {
//     const selectedStyle = this.value;
//     document.body.className = selectedStyle;
    
//     if (selectedStyle === 'zerodha') {
//         logoElement.textContent = 'Zerodha';
//     } else if (selectedStyle === 'motilal') {
//         logoElement.textContent = 'Motilal Oswal';
//     }
    
//     updateVisibility();
//     updateChartTheme();
// });

document.getElementById('styleSelector').addEventListener('change', function() {
    const selectedStyle = this.value;
    document.body.className = selectedStyle;
    
    if (selectedStyle === 'zerodha') {
        logoElement.textContent = 'Zerodha';
    } else if (selectedStyle === 'motilal') {
        logoElement.textContent = 'Motilal Oswal';
    }
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
      }
    updateVisibility();
    updateChartTheme();
});

document.addEventListener('DOMContentLoaded', function() {
    const styleSelector = document.getElementById('styleSelector');
    const currentStyle = document.body.className || styleSelector.value;

    if (currentStyle === 'zerodha') {
        logoElement.textContent = 'Zerodha';
    } else if (currentStyle === 'motilal') {
        logoElement.textContent = 'Motilal Oswal';
    }
});






