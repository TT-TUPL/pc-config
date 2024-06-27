 document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll(".nav-links a");
    const currentUrl = window.location.href;

    navLinks.forEach(link => {
        if (link.href === currentUrl) {
            link.classList.add("active");
        }
    });

    const componentFiles = {
        cpu: "cpu-data.json",
        motherboard: "mb-data.json",
        gpu: "gpu-data.json",
        case: "case-data.json",
        ram: "ram-data.json",
        storage: "storage-data.json",
        psu: "psu-data.json"
    };

    const componentsData = {};
  
    const componentType = getComponentTypeFromURL();

    Promise.all(
        Object.entries(componentFiles).map(([key, file]) =>
            fetch(file)
                .then(response => response.json())
                .then(data => {
                    componentsData[key] = data;
                    if (key === componentType) {
                        populateFilterOptions(data, key);
                        displayComponentList(data, key);
                        document.getElementById('apply-filters').click();
                    }
                })
        )
    ).then(() => {
        console.log('Components data:', componentsData);
        updateTotalPrice(componentsData);
        checkCompatibility(componentsData);
    }).catch(error => {
        console.error('Error fetching the JSON data:', error);
    });

    setupSliders();

    document.querySelector('.compatibility-button').addEventListener('click', () => checkCompatibility(componentsData));
});

function updateTotalPrice(componentsData) {
    let totalPrice = 0;

    const selectedCpu = localStorage.getItem('selected-cpu');
    if (selectedCpu) {
        const cpuData = componentsData.cpu.find(cpu => cpu.cpuname === selectedCpu);
        if (cpuData) {
            totalPrice += cpuData.cpuprice;
        }
    }
    const selectedMotherboard = localStorage.getItem('selected-motherboard');
    if (selectedMotherboard) {
        const motherboardData = componentsData.motherboard.find(motherboard => motherboard.mbname === selectedMotherboard);
        if (motherboardData) {
            totalPrice += motherboardData.mbprice;
        }
    }
    const selectedGpu = localStorage.getItem('selected-gpu');
    if (selectedGpu) {
        const gpuData = componentsData.gpu.find(gpu => gpu.gpuname === selectedGpu);
        if (gpuData) {
            totalPrice += gpuData.gpuprice;
        }
    }
    const selectedCase = localStorage.getItem('selected-case');
    if (selectedCase) {
        const caseData = componentsData.case.find(pccase => pccase.casename === selectedCase);
        if (caseData) {
            totalPrice += caseData.caseprice;
        }
    }
    const selectedRam = localStorage.getItem('selected-ram');
    if (selectedRam) {
        const ramData = componentsData.ram.find(ram => ram.ramname === selectedRam);
        if (ramData) {
            totalPrice += ramData.ramprice;
        }
    }
    const selectedStorage = localStorage.getItem('selected-storage');
    if (selectedStorage) {
        const storageData = componentsData.storage.find(storage => storage.storagename === selectedStorage);
        if (storageData) {
            totalPrice += storageData.storageprice;
        }
    }
    const selectedPsu = localStorage.getItem('selected-psu');
    if (selectedPsu) {
        const psuData = componentsData.psu.find(psu => psu.psuname === selectedPsu);
        if (psuData) {
            totalPrice += psuData.psuprice;
        }
    }

    document.getElementById('total-price').textContent = totalPrice.toFixed(2);
}

function handleComponentSelection(componentName, type) {
    localStorage.setItem(`selected-${type}`, componentName);
    window.location.href = 'builder.html';
}

function getComponentTypeFromURL() {
    const url = window.location.href;
    if (url.includes('select-cpu.html')) return 'cpu';
    if (url.includes('select-motherboard.html')) return 'motherboard';
    if (url.includes('select-gpu.html')) return 'gpu';
    if (url.includes('select-case.html')) return 'case';
    if (url.includes('select-ram.html')) return 'ram';
    if (url.includes('select-storage.html')) return 'storage';
    if (url.includes('select-psu.html')) return 'psu';
    return null;
}

function populateFilterOptions(data, type) {
    const filters = {
        cpu: {
            name: document.getElementById('name-filter'),
            brand: document.getElementById('brand-filter'),
            coreCount: document.getElementById('core-count-filter'),
            graphics: document.getElementById('graphics-filter'),
            socket: document.getElementById('socket-filter')
        },
        motherboard: {
            name: document.getElementById('name-filter'),
            brand: document.getElementById('brand-filter'),
            formFactor: document.getElementById('form-factor-filter'),
            socket: document.getElementById('socket-filter'),
            chipset: document.getElementById('chipset-filter'),
            supportedDdrType: document.getElementById('supported-ddr-type-filter'),
            memorySlots: document.getElementById('memory-slots-filter'),
            color: document.getElementById('color-filter')
        },
        gpu: {
            name: document.getElementById('name-filter'),
            brand: document.getElementById('brand-filter'),
            model: document.getElementById('model-filter'),
            memory: document.getElementById('memory-filter')
        },
        case: {
            name: document.getElementById('name-filter'),
            brand: document.getElementById('brand-filter'),
            type: document.getElementById('type-filter'),
            color: document.getElementById('color-filter'),
            sidepanel: document.getElementById('side-panel-filter'),
            internalbays: document.getElementById('internal-bays-filter')
        },
        ram: {
            name: document.getElementById('name-filter'),
            brand: document.getElementById('brand-filter'),
            modules: document.getElementById('modules-filter'),
            capacity: document.getElementById('capacity-filter'),
            color: document.getElementById('color-filter'),
            ddrType: document.getElementById('ddr-type-filter')
        },
        storage: {
            name: document.getElementById('name-filter'),
            brand: document.getElementById('brand-filter'),
            type: document.getElementById('type-filter'),
            cache: document.getElementById('cache-filter'),
            formFactor: document.getElementById('form-factor-filter'),
            interface: document.getElementById('interface-filter')
        },
        psu: {
            name: document.getElementById('name-filter'),
            brand: document.getElementById('brand-filter'),
            type: document.getElementById('type-filter'),
            efficiency: document.getElementById('efficiency-filter'),
            modular: document.getElementById('modular-filter'),
            color: document.getElementById('color-filter')
        }
    };

    const uniqueValues = {
        cpu: {
            name: ["All", ...new Set(data.map(item => item.cpuname))],
            brand: ["All", ...new Set(data.map(item => item.cpubrand))],
            coreCount: ["All", ...new Set(data.map(item => item.core_count))].sort((a, b) => a - b),
            graphics: ["All", ...new Set(data.map(item => item.graphics))],
            socket: ["All", ...new Set(data.map(item => item.cpusocket))]
        },
        motherboard: {
            name: ["All", ...new Set(data.map(item => item.mbname))],
            brand: ["All", ...new Set(data.map(item => item.mbbrand))],
            formFactor: ["All", ...new Set(data.map(item => item.mbformfactor))],
            socket: ["All", ...new Set(data.map(item => item.mbsocket))],
            chipset: ["All", ...new Set(data.map(item => item.chipset))],
            supportedDdrType: ["All", ...new Set(data.map(item => item.supported_ddr_type))],
            memorySlots: ["All", ...new Set(data.map(item => item.memoryslots))].sort((a, b) => a - b),
            color: ["All", ...new Set(data.map(item => item.mbcolor))]
        },
        gpu: {
            name: ["All", ...new Set(data.map(item => item.gpuname))],
            brand: ["All", ...new Set(data.map(item => item.brand))],
            model: ["All", ...new Set(data.map(item => item.model))],
            memory: ["All", ...new Set(data.map(item => item.memory))].sort((a, b) => a - b)
        },
        case: {
            name: ["All", ...new Set(data.map(item => item.casename))],
            brand: ["All", ...new Set(data.map(item => item.casebrand))],
            type: ["All", ...new Set(data.map(item => item.casetype))],
            color: ["All", ...new Set(data.map(item => item.casecolor))],
            sidepanel: ["All", ...new Set(data.map(item => item.side_panel))],
            internalbays: ["All", ...new Set(data.map(item => item.internal_35_bays))].sort((a, b) => a - b)
        },
        ram: {
            name: ["All", ...new Set(data.map(item => item.ramname))],
            brand: ["All", ...new Set(data.map(item => item.rambrand))],
            modules: ["All", ...new Set(data.map(item => item.modules))].sort((a, b) => a - b),
            capacity: ["All", ...new Set(data.map(item => item.capacity))].sort((a, b) => a - b),
            color: ["All", ...new Set(data.map(item => item.ramcolor))],
            ddrType: ["All", ...new Set(data.map(item => item.ddr_type))]
        },
        storage: {
            name: ["All", ...new Set(data.map(item => item.storagename))],
            brand: ["All", ...new Set(data.map(item => item.storagebrand))],
            type: ["All", ...new Set(data.map(item => item.storagetype))],
            cache: ["All", ...new Set(data.map(item => item.cache))].sort((a, b) => a - b),
            formFactor: ["All", ...new Set(data.map(item => item.storage_form_factor))],
            interface: ["All", ...new Set(data.map(item => item.interface))]
        },
        psu: {
            name: ["All", ...new Set(data.map(item => item.psuname))],
            brand: ["All", ...new Set(data.map(item => item.psubrand))],
            type: ["All", ...new Set(data.map(item => item.psutype))],
            efficiency: ["All", ...new Set(data.map(item => item.efficiency))],
            modular: ["All", ...new Set(data.map(item => item.modular))],
            color: ["All", ...new Set(data.map(item => item.psucolor))]
        }
    };

    for (const key in uniqueValues[type]) {
        uniqueValues[type][key].forEach(value => {
            const option = document.createElement('option');
            option.value = value === "All" ? "" : value;
            option.text = value;
            if (filters[type] && filters[type][key]) {
                filters[type][key].appendChild(option);
            }
        });
    }
    const nameFilter = filters[type].name;
    if (nameFilter) {
        nameFilter.addEventListener('input', () => {
            document.getElementById('apply-filters').click();
        });
    }
    
}

function setupSliders() {
    const priceSlider = document.getElementById('price-slider');
    const priceValue = document.getElementById('price-value');
    if (priceSlider) {
        noUiSlider.create(priceSlider, {
            start: [0, 2000],
            connect: true,
            range: {
                'min': 0,
                'max': 2000
            },
            step: 10
        });
        priceSlider.noUiSlider.on('update', function(values, handle) {
            priceValue.textContent = `$${Math.round(values[0])} - $${Math.round(values[1])}`;
        });
    }

    const coreClockSlider = document.getElementById('core-clock-slider');
    const coreClockValue = document.getElementById('core-clock-value');
    if (coreClockSlider) {
        noUiSlider.create(coreClockSlider, {
            start: [0, 6],
            connect: true,
            range: {
                'min': 0,
                'max': 6
            },
            step: 0.1
        });
        coreClockSlider.noUiSlider.on('update', function(values, handle) {
            coreClockValue.textContent = `${values[0]} GHz - ${values[1]} GHz`;
        });
    }

    const boostClockSlider = document.getElementById('boost-clock-slider');
    const boostClockValue = document.getElementById('boost-clock-value');
    if (boostClockSlider) {
        noUiSlider.create(boostClockSlider, {
            start: [0, 6],
            connect: true,
            range: {
                'min': 0,
                'max': 6
            },
            step: 0.1
        });
        boostClockSlider.noUiSlider.on('update', function(values, handle) {
            boostClockValue.textContent = `${values[0]} GHz - ${values[1]} GHz`;
        });
    }

    const tdpSlider = document.getElementById('tdp-slider');
    const tdpValue = document.getElementById('tdp-value');
    if (tdpSlider) {
        noUiSlider.create(tdpSlider, {
            start: [0, 500],
            connect: true,
            range: {
                'min': 0,
                'max': 500
            },
            step: 10
        });
        tdpSlider.noUiSlider.on('update', function(values, handle) {
            tdpValue.textContent = `${values[0]} W - ${values[1]} W`;
        });
    }

    const maxMemorySlider = document.getElementById('max-memory-slider');
    const maxMemoryValue = document.getElementById('max-memory-value');
    if (maxMemorySlider) {
        noUiSlider.create(maxMemorySlider, {
            start: [0, 256],
            connect: true,
            range: {
                'min': 0,
                'max': 256
            },
            step: 32
        });
        maxMemorySlider.noUiSlider.on('update', function(values, handle) {
            maxMemoryValue.textContent = `${values[0]} GB - ${values[1]} GB`;
        });
    }
    const supportedRamSpeedSlider = document.getElementById('supported-ram-speed-slider');
    const supportedRamSpeedValue = document.getElementById('supported-ram-speed-value');
    if (supportedRamSpeedSlider) {
        noUiSlider.create(supportedRamSpeedSlider, {
            start: [0, 8000],
            connect: true,
            range: {
                'min': 0,
                'max': 8000
            },
            step: 400
        });
        supportedRamSpeedSlider.noUiSlider.on('update', function(values, handle) {
            supportedRamSpeedValue.textContent = `${values[0]} MHz - ${values[1]} MHz`;
        });
    }
    const gpucoreClockSlider = document.getElementById('gpu-core-clock-slider');
    const gpucoreClockValue = document.getElementById('gpu-core-clock-value');
    if (gpucoreClockSlider) {
        noUiSlider.create(gpucoreClockSlider, {
            start: [0, 3000],
            connect: true,
            range: {
                'min': 0,
                'max': 3000
            },
            step: 100
        });
        gpucoreClockSlider.noUiSlider.on('update', function(values, handle) {
            gpucoreClockValue.textContent = `${values[0]} MHz - ${values[1]} MHz`;
        });
    }

    const gpuboostClockSlider = document.getElementById('gpu-boost-clock-slider');
    const gpuboostClockValue = document.getElementById('gpu-boost-clock-value');
    if (gpuboostClockSlider) {
        noUiSlider.create(gpuboostClockSlider, {
            start: [0, 3000],
            connect: true,
            range: {
                'min': 0,
                'max': 3000
            },
            step: 100
        });
        gpuboostClockSlider.noUiSlider.on('update', function(values, handle) {
            gpuboostClockValue.textContent = `${values[0]} MHz - ${values[1]} MHz`;
        });
    }
    const lengthSlider = document.getElementById('length-slider');
    const lengthValue = document.getElementById('length-value');
    if (lengthSlider) {
        noUiSlider.create(lengthSlider, {
            start: [0, 500],
            connect: true,
            range: {
                'min': 0,
                'max': 500
            },
            step: 50
        });
        lengthSlider.noUiSlider.on('update', function(values, handle) {
            lengthValue.textContent = `${values[0]} mm - ${values[1]} mm`;
        });
    }
    const externalVolumeSlider = document.getElementById('external-volume-slider');
    const externalVolumeValue = document.getElementById('external-volume-value');
    if (externalVolumeSlider) {
        noUiSlider.create(externalVolumeSlider, {
            start: [0, 100],
            connect: true,
            range: {
                'min': 0,
                'max': 100
            },
            step: 5
        });
        externalVolumeSlider.noUiSlider.on('update', function(values, handle) {
            externalVolumeValue.textContent = `${values[0]} L - ${values[1]} L`;
        });
    }
    const compatibleGpuSizeSlider = document.getElementById('compatible-gpu-size-slider');
    const compatibleGpuSizeValue = document.getElementById('compatible-gpu-size-value');
    if (compatibleGpuSizeSlider) {
        noUiSlider.create(compatibleGpuSizeSlider, {
            start: [0, 500],
            connect: true,
            range: {
                'min': 0,
                'max': 500
            },
            step: 10
        });
        compatibleGpuSizeSlider.noUiSlider.on('update', function(values, handle) {
            compatibleGpuSizeValue.textContent = `${values[0]} mm - ${values[1]} mm`;
        });
    }
    const ramSpeedSlider = document.getElementById('ram-speed-slider');
    const ramSpeedValue = document.getElementById('ram-speed-value');
    if (ramSpeedSlider) {
        noUiSlider.create(ramSpeedSlider, {
            start: [0, 6600],
            connect: true,
            range: {
                'min': 0,
                'max': 6600
            },
            step: 400
        });
        ramSpeedSlider.noUiSlider.on('update', function(values, handle) {
            ramSpeedValue.textContent = `${values[0]} MHz - ${values[1]} MHz`;
        });
    }
    const casLatencySlider = document.getElementById('cas-latency-slider');
    const casLatencyValue = document.getElementById('cas-latency-value');
    if (casLatencySlider) {
        noUiSlider.create(casLatencySlider, {
            start: [0, 40],
            connect: true,
            range: {
                'min': 0,
                'max': 40
            },
            step: 2
        });
        casLatencySlider.noUiSlider.on('update', function(values, handle) {
            casLatencyValue.textContent = `${values[0]} - ${values[1]}`;
        });
    }
    const storageCapacitySlider = document.getElementById('storage-capacity-slider');
    const storageCapacityValue = document.getElementById('storage-capacity-value');
    if (storageCapacitySlider) {
        noUiSlider.create(storageCapacitySlider, {
            start: [0, 10000],
            connect: true,
            range: {
                'min': 0,
                'max': 10000
            },
            step: 100
        });
        storageCapacitySlider.noUiSlider.on('update', function(values, handle) {
            storageCapacityValue.textContent = `${values[0]} GB - ${values[1]} GB`;
        });
    }
    const wattageSlider = document.getElementById('wattage-slider');
    const wattageValue = document.getElementById('wattage-value');
    if (wattageSlider) {
        noUiSlider.create(wattageSlider, {
            start: [0, 2500],
            connect: true,
            range: {
                'min': 0,
                'max': 2500
            },
            step: 50
        });
        wattageSlider.noUiSlider.on('update', function(values, handle) {
            wattageValue.textContent = `${values[0]} W - ${values[1]} W`;
        });
    }
}

function displayComponentList(data, type) {
    const listElement = document.getElementById(`${type}-list`);
    const filters = {
        cpu: {
            name: document.getElementById('name-filter'),
            brand: document.getElementById('brand-filter'),
            price: document.getElementById('price-slider'),
            coreCount: document.getElementById('core-count-filter'),
            coreClock: document.getElementById('core-clock-slider'),
            boostClock: document.getElementById('boost-clock-slider'),
            tdp: document.getElementById('tdp-slider'),
            graphics: document.getElementById('graphics-filter'),
            socket: document.getElementById('socket-filter')
        },
        motherboard: {
            name: document.getElementById('name-filter'),
            brand: document.getElementById('brand-filter'),
            price: document.getElementById('price-slider'),
            formFactor: document.getElementById('form-factor-filter'),
            socket: document.getElementById('socket-filter'),
            chipset: document.getElementById('chipset-filter'),
            supportedDdrType: document.getElementById('supported-ddr-type-filter'),
            supportedRamSpeed: document.getElementById('supported-ram-speed-slider'),
            maxMemory: document.getElementById('max-memory-slider'),
            memorySlots: document.getElementById('memory-slots-filter'),
            color: document.getElementById('color-filter')
        },
        gpu: {
            name: document.getElementById('name-filter'),
            brand: document.getElementById('brand-filter'),
            model: document.getElementById('model-filter'),
            memory: document.getElementById('memory-filter'),
            gpucoreClock: document.getElementById('gpu-core-clock-slider'),
            gpuboostClock: document.getElementById('gpu-boost-clock-slider'),
            price: document.getElementById('price-slider'),
            tdp: document.getElementById('tdp-slider'),
            length: document.getElementById('length-slider')
        },
        case: {
            name: document.getElementById('name-filter'),
            brand: document.getElementById('brand-filter'),
            price: document.getElementById('price-slider'),
            type: document.getElementById('type-filter'),
            color: document.getElementById('color-filter'),
            sidepanel: document.getElementById('side-panel-filter'),
            externalVolume: document.getElementById('external-volume-slider'),
            internalbays: document.getElementById('internal-bays-filter'),
            compatibleGpuSize: document.getElementById('compatible-gpu-size-slider')
        },
        ram: {
            name: document.getElementById('name-filter'),
            brand: document.getElementById('brand-filter'),
            price: document.getElementById('price-slider'),
            ramSpeed: document.getElementById('ram-speed-slider'),
            modules: document.getElementById('modules-filter'),
            capacity: document.getElementById('capacity-filter'),
            color: document.getElementById('color-filter'),
            casLatency: document.getElementById('cas-latency-slider'),
            ddrType: document.getElementById('ddr-type-filter')
        },
        storage: {
            name: document.getElementById('name-filter'),
            brand: document.getElementById('brand-filter'),
            price: document.getElementById('price-slider'),
            storageCapacity: document.getElementById('storage-capacity-slider'),
            type: document.getElementById('type-filter'),
            cache: document.getElementById('cache-filter'),
            formFactor: document.getElementById('form-factor-filter'),
            interface: document.getElementById('interface-filter')
        },
        psu: {
            name: document.getElementById('name-filter'),
            brand: document.getElementById('brand-filter'),
            price: document.getElementById('price-slider'),
            type: document.getElementById('type-filter'),
            efficiency: document.getElementById('efficiency-filter'),
            wattage: document.getElementById('wattage-slider'),
            modular: document.getElementById('modular-filter'),
            color: document.getElementById('color-filter')
        }
    };

    function renderList(filter = {}) {
        listElement.innerHTML = '';
        const filteredData = data.filter(item => {
            let isValid = true;
            if (type === 'cpu') {
                if (filter.name && !item.cpuname.toLowerCase().includes(filter.name.toLowerCase())) {
                    isValid = false;
                }
                if (filter.brand && item.cpubrand !== filter.brand) {
                    isValid = false;
                }
                if (filter.price) {
                    const priceRange = filters.cpu.price.noUiSlider.get();
                    if (item.cpuprice < parseFloat(priceRange[0]) || item.cpuprice > parseFloat(priceRange[1])) {
                        isValid = false;
                    }
                }
                if (filter.coreCount && item.core_count !== parseInt(filter.coreCount)) {
                    isValid = false;
                }
                if (filter.coreClock) {
                    const coreClockRange = filters.cpu.coreClock.noUiSlider.get();
                    if (item.core_clock < parseFloat(coreClockRange[0]) || item.core_clock > parseFloat(coreClockRange[1])) {
                        isValid = false;
                    }
                }
                if (filter.boostClock) {
                    const boostClockRange = filters.cpu.boostClock.noUiSlider.get();
                    if (item.boost_clock < parseFloat(boostClockRange[0]) || item.boost_clock > parseFloat(boostClockRange[1])) {
                        isValid = false;
                    }
                }
                if (filter.tdp) {
                    const tdpRange = filters.cpu.tdp.noUiSlider.get();
                    if (item.tdp < parseFloat(tdpRange[0]) || item.tdp > parseFloat(tdpRange[1])) {
                        isValid = false;
                    }
                }
                if (filter.graphics && item.graphics !== filter.graphics) {
                    isValid = false;
                }
                if (filter.socket && item.cpusocket !== filter.socket) {
                    isValid = false;
                }
            } else if (type === 'motherboard') {
                if (filter.name && !item.mbname.toLowerCase().includes(filter.name.toLowerCase())) {
                    isValid = false;
                }
                if (filter.brand && item.mbbrand !== filter.brand) {
                    isValid = false;
                }
                if (filter.price) {
                    const priceRange = filters.motherboard.price.noUiSlider.get();
                    if (item.mbprice < parseFloat(priceRange[0]) || item.mbprice > parseFloat(priceRange[1])) {
                        isValid = false;
                    }
                }
                if (filter.formFactor && item.mbformfactor !== filter.formFactor) {
                    isValid = false;
                }
                if (filter.socket && item.mbsocket !== filter.socket) {
                    isValid = false;
                }
                if (filter.chipset && item.chipset !== filter.chipset) {
                    isValid = false;
                }
                if (filter.supportedDdrType && item.supported_ddr_type !== filter.supportedDdrType) {
                    isValid = false;
                }
                if (filter.supportedRamSpeed) {
                    const supportedRamSpeedRange = filters.motherboard.supportedRamSpeed.noUiSlider.get();
                    if (item.supported_ram_speed < parseFloat(supportedRamSpeedRange[0]) || item.supported_ram_speed > parseFloat(supportedRamSpeedRange[1])) {
                        isValid = false;
                    }
                }
                if (filter.maxMemory) {
                    const maxMemoryRange = filters.motherboard.maxMemory.noUiSlider.get();
                    if (item.maxmemory < parseFloat(maxMemoryRange[0]) || item.maxmemory > parseFloat(maxMemoryRange[1])) {
                        isValid = false;
                    }
                }
                if (filter.memorySlots && item.memoryslots !== parseInt(filter.memorySlots)) {
                    isValid = false;
                }
                if (filter.color && item.mbcolor !== filter.color) {
                    isValid = false;
                }
            } else if (type === 'gpu') {
                if (filter.name && !item.gpuname.toLowerCase().includes(filter.name.toLowerCase())) {
                    isValid = false;
                }
                if (filter.brand && item.brand !== filter.brand) {
                    isValid = false;
                }
                if (filter.model && item.model !== filter.model) {
                    isValid = false;
                }
                if (filter.memory && item.memory !== filter.memory) {
                    isValid = false;
                }
                if (filter.gpucoreClock) {
                    const gpucoreClockRange = filters.gpu.gpucoreClock.noUiSlider.get();
                    if (item.gpucoreclock < parseFloat(gpucoreClockRange[0]) || item.gpucoreclock > parseFloat(gpucoreClockRange[1])) {
                        isValid = false;
                    }
                }
                if (filter.gpuboostClock) {
                    const gpuboostClockRange = filters.gpu.gpuboostClock.noUiSlider.get();
                    if (item.gpuboostclock < parseFloat(gpuboostClockRange[0]) || item.gpuboostclock > parseFloat(gpuboostClockRange[1])) {
                        isValid = false;
                    }
                }
                if (filter.price) {
                    const priceRange = filters.gpu.price.noUiSlider.get();
                    if (item.gpuprice < parseFloat(priceRange[0]) || item.gpuprice > parseFloat(priceRange[1])) {
                        isValid = false;
                    }
                }
                if (filter.tdp) {
                    const tdpRange = filters.gpu.tdp.noUiSlider.get();
                    if (item.tdp < parseFloat(tdpRange[0]) || item.tdp > parseFloat(tdpRange[1])) {
                        isValid = false;
                    }
                }
                if (filter.length) {
                    const lengthRange = filters.gpu.length.noUiSlider.get();
                    if (item.length < parseFloat(lengthRange[0]) || item.length > parseFloat(lengthRange[1])) {
                        isValid = false;
                    }
                }
            } else if (type === 'case') {
                if (filter.name && !item.casename.toLowerCase().includes(filter.name.toLowerCase())) {
                    isValid = false;
                }
                if (filter.brand && item.casebrand !== filter.brand) {
                    isValid = false;
                }
                if (filter.price) {
                    const priceRange = filters.case.price.noUiSlider.get();
                    if (item.caseprice < parseFloat(priceRange[0]) || item.caseprice > parseFloat(priceRange[1])) {
                        isValid = false;
                    }
                }
                if (filter.type && item.casetype !== filter.type) {
                    isValid = false;
                }
                if (filter.color && item.casecolor !== filter.color) {
                    isValid = false;
                }
                if (filter.sidepanel && item.side_panel !== filter.sidepanel) {
                    isValid = false;
                }
                if (filter.externalVolume) {
                    const externalVolumeRange = filters.case.externalVolume.noUiSlider.get();
                    if (item.external_volume < parseFloat(externalVolumeRange[0]) || item.external_volume > parseFloat(externalVolumeRange[1])) {
                        isValid = false;
                    }
                }
                if (filter.internalbays && item.internal_35_bays !== parseInt(filter.internalbays)) {
                    isValid = false;
                }
                if (filter.compatibleGpuSize) {
                    const compatibleGpuSizeRange = filters.case.compatibleGpuSize.noUiSlider.get();
                    if (item.compatible_gpu_size < parseFloat(compatibleGpuSizeRange[0]) || item.compatible_gpu_size > parseFloat(compatibleGpuSizeRange[1])) {
                        isValid = false;
                    }
                }
            }
               else if (type === 'ram') {
                if (filter.name && !item.ramname.toLowerCase().includes(filter.name.toLowerCase())) {
                    isValid = false;
                }
                if (filter.brand && item.rambrand !== filter.brand) {
                    isValid = false;
                }
                if (filter.price) {
                    const priceRange = filters.ram.price.noUiSlider.get();
                    if (item.ramprice < parseFloat(priceRange[0]) || item.ramprice > parseFloat(priceRange[1])) {
                        isValid = false;
                    }
                }
                if (filter.ramSpeed) {
                    const ramSpeedRange = filters.ram.ramSpeed.noUiSlider.get();
                    if (item.speed < parseFloat(ramSpeedRange[0]) || item.speed > parseFloat(ramSpeedRange[1])) {
                        isValid = false;
                    }
                }
                if (filter.modules && item.modules !== parseInt(filter.modules)) {
                    isValid = false;
                }
                if (filter.capacity && item.capacity !== parseInt(filter.capacity)) {
                    isValid = false;
                }
                if (filter.color && item.ramcolor !== filter.color) {
                    isValid = false;
                }
                if (filter.casLatency) {
                    const casLatencyRange = filters.ram.casLatency.noUiSlider.get();
                    if (item.cas_latency < parseFloat(casLatencyRange[0]) || item.cas_latency > parseFloat(casLatencyRange[1])) {
                        isValid = false;
                    }
                }
                if (filter.ddrType && item.ddr_type !== filter.ddrType) {
                    isValid = false;
                }
              }
            else if (type === 'storage') {
                if (filter.name && !item.storagename.toLowerCase().includes(filter.name.toLowerCase())) {
                    isValid = false;
                }
                if (filter.brand && item.storagebrand !== filter.brand) {
                    isValid = false;
                }
                if (filter.price) {
                    const priceRange = filters.storage.price.noUiSlider.get();
                    if (item.storageprice < parseFloat(priceRange[0]) || item.storageprice > parseFloat(priceRange[1])) {
                        isValid = false;
                    }
                }
                if (filter.storageCapacity) {
                    const storageCapacityRange = filters.storage.storageCapacity.noUiSlider.get();
                    if (item.storagecapacity < parseFloat(storageCapacityRange[0]) || item.storagecapacity > parseFloat(storageCapacityRange[1])) {
                        isValid = false;
                    }
                }
                if (filter.type && item.storagetype !== filter.type) {
                    isValid = false;
                }
                if (filter.cache && item.cache !== parseInt(filter.cache)) {
                    isValid = false;
                }
                if (filter.formFactor && item.storage_form_factor !== filter.formFactor) {
                    isValid = false;
                }
                if (filter.interface && item.interface !== filter.interface) {
                    isValid = false;
                }
              }
           else if (type === 'psu') {
                if (filter.name && !item.psuname.toLowerCase().includes(filter.name.toLowerCase())) {
                    isValid = false;
                }
                if (filter.brand && item.psubrand !== filter.brand) {
                    isValid = false;
                }
                if (filter.price) {
                    const priceRange = filters.psu.price.noUiSlider.get();
                    if (item.psuprice < parseFloat(priceRange[0]) || item.psuprice > parseFloat(priceRange[1])) {
                        isValid = false;
                    }
                }
                if (filter.type && item.psutype !== filter.type) {
                    isValid = false;
                }
                if (filter.efficiency && item.efficiency !== filter.efficiency) {
                    isValid = false;
                }
                if (filter.wattage) {
                    const wattageRange = filters.psu.wattage.noUiSlider.get();
                    if (item.wattage < parseFloat(wattageRange[0]) || item.wattage > parseFloat(wattageRange[1])) {
                        isValid = false;
                    }
                }
                if (filter.modular && item.modular !== filter.modular) {
                    isValid = false;
                }
                if (filter.color && item.psucolor !== filter.color) {
                    isValid = false;
                }
              }
            return isValid;
        });

        filteredData.forEach(item => {
            const li = document.createElement('li');
            if (type === 'cpu') {
                li.innerHTML = `
                    <div class="component-details">
                        <span><strong>Name:</strong> ${item.cpuname}</span>
                        <span><strong>Brand:</strong> ${item.cpubrand}</span>
                        <span><strong>Price:</strong> $${item.cpuprice}</span>
                        <span><strong>Core Count:</strong> ${item.core_count}</span>
                        <span><strong>Core Clock:</strong> ${item.core_clock} GHz</span>
                        <span><strong>Boost Clock:</strong> ${item.boost_clock} GHz</span>
                        <span><strong>TDP:</strong> ${item.tdp} W</span>
                        <span><strong>Graphics:</strong> ${item.graphics}</span>
                        <span><strong>Socket:</strong> ${item.cpusocket}</span>
                        <span><strong>Compatible Chipsets:</strong> ${item.chipsets.join(", ")}</span>
                    </div>
                `;
            } else if (type === 'motherboard') {
                li.innerHTML = `
                    <div class="component-details">
                        <span><strong>Name:</strong> ${item.mbname}</span>
                        <span><strong>Brand:</strong> ${item.mbbrand}</span>
                        <span><strong>Price:</strong> $${item.mbprice}</span>
                        <span><strong>Form Factor:</strong> ${item.mbformfactor}</span>
                        <span><strong>Socket:</strong> ${item.mbsocket}</span>
                        <span><strong>Chipset:</strong> ${item.chipset}</span>
                        <span><strong>Max Memory:</strong> ${item.maxmemory} GB</span>
                        <span><strong>Supported DDR Type:</strong> ${item.supported_ddr_type}</span>
                        <span><strong>Supported RAM Speed:</strong> ${item.supported_ram_speed} MHz</span>
                        <span><strong>Memory Slots:</strong> ${item.memoryslots}</span>
                        <span><strong>Color:</strong> ${item.mbcolor}</span>
                        <span><strong>Supported Interfaces:</strong> ${item.supportedinterfaces.join(", ")}</span>
                    </div>
                `;
            } else if (type === 'gpu') {
                li.innerHTML = `
                    <div class="component-details">
                        <span><strong>Name:</strong> ${item.gpuname}</span>
                        <span><strong>Brand:</strong> ${item.brand}</span>
                        <span><strong>Price:</strong> $${item.gpuprice}</span>
                        <span><strong>Model:</strong> ${item.model}</span>
                        <span><strong>Memory:</strong> ${item.memory} GB</span>
                        <span><strong>Core Clock:</strong> ${item.gpucoreclock} MHz</span>
                        <span><strong>Boost Clock:</strong> ${item.gpuboostclock} MHz</span>
                        <span><strong>TDP:</strong> ${item.tdp} W</span>
                        <span><strong>Length:</strong> ${item.length} mm</span>
                    </div>
                `;
            }
             else if (type === 'case') {
                li.innerHTML = `
                    <div class="component-details">
                        <span><strong>Name:</strong> ${item.casename}</span>
                        <span><strong>Brand:</strong> ${item.casebrand}</span>
                        <span><strong>Price:</strong> $${item.caseprice}</span>
                        <span><strong>Type:</strong> ${item.casetype}</span>
                        <span><strong>Color:</strong> ${item.casecolor}</span>
                        <span><strong>Side Panel:</strong> ${item.side_panel}</span>
                        <span><strong>External Volume:</strong> ${item.external_volume} L</span>
                        <span><strong>Internal 3.5" Bays:</strong> ${item.internal_35_bays}</span>
                        <span><strong>Compatible GPU Size:</strong> ${item.compatible_gpu_size} mm</span>
                    </div>
                `;
            }
             else if (type === 'ram') {
                li.innerHTML = `
                    <div class="component-details">
                        <span><strong>Name:</strong> ${item.ramname}</span>
                        <span><strong>Brand:</strong> ${item.rambrand}</span>
                        <span><strong>Price:</strong> $${item.ramprice}</span>
                        <span><strong>Speed:</strong> ${item.speed} MHz</span>
                        <span><strong>Modules:</strong> ${item.modules}</span>
                        <span><strong>Capacity:</strong> ${item.capacity} GB</span>
                        <span><strong>Color:</strong> ${item.ramcolor}</span>
                        <span><strong>CAS Latency:</strong> ${item.cas_latency}</span>
                        <span><strong>DDR Type:</strong> ${item.ddr_type}</span>
                    </div>
                `;
            }
             else if (type === 'storage') {
                li.innerHTML = `
                    <div class="component-details">
                        <span><strong>Name:</strong> ${item.storagename}</span>
                        <span><strong>Brand:</strong> ${item.storagebrand}</span>
                        <span><strong>Price:</strong> $${item.storageprice}</span>
                        <span><strong>Capacity:</strong> ${item.storagecapacity} GB</span>
                        <span><strong>Type:</strong> ${item.storagetype}</span>
                        <span><strong>Cache:</strong> ${item.cache} MB</span>
                        <span><strong>Form Factor:</strong> ${item.storage_form_factor}</span>
                        <span><strong>Interface:</strong> ${item.interface}</span>
                    </div>
                `;
            }
             else if (type === 'psu') {
                li.innerHTML = `
                    <div class="component-details">
                        <span><strong>Name:</strong> ${item.psuname}</span>
                        <span><strong>Brand:</strong> ${item.psubrand}</span>
                        <span><strong>Price:</strong> $${item.psuprice}</span>
                        <span><strong>Type:</strong> ${item.psutype}</span>
                        <span><strong>Efficiency:</strong> ${item.efficiency}</span>
                        <span><strong>Wattage:</strong> ${item.wattage} W</span>
                        <span><strong>Modularity:</strong> ${item.modular}</span>
                        <span><strong>Color:</strong> ${item.psucolor}</span>
                    </div>
                `;
            }
            li.addEventListener('click', function() {
                localStorage.setItem(`selected-${type}`, item[type === 'cpu' ? 'cpuname' : type === 'motherboard' ? 'mbname' : type === 'gpu' ? 'gpuname' : type === 'case' ? 'casename' : type === 'ram' ? 'ramname' : type === 'storage' ? 'storagename' : type === 'psu' ? 'psuname' : type + 'name']);
                window.location.href = 'builder.html';
            });
            listElement.appendChild(li);
        });
    }

    document.getElementById('apply-filters').addEventListener('click', () => {
        const filterValues = type === 'cpu' ? {
            name: filters.cpu.name.value,
            brand: filters.cpu.brand.value,
            price: filters.cpu.price.noUiSlider.get(),
            coreCount: filters.cpu.coreCount.value,
            coreClock: filters.cpu.coreClock.noUiSlider.get(),
            boostClock: filters.cpu.boostClock.noUiSlider.get(),
            tdp: filters.cpu.tdp.noUiSlider.get(),
            graphics: filters.cpu.graphics.value,
            socket: filters.cpu.socket.value
        } : type === 'motherboard' ? {
            name: filters.motherboard.name.value,
            brand: filters.motherboard.brand.value,
            price: filters.motherboard.price.noUiSlider.get(),
            formFactor: filters.motherboard.formFactor.value,
            socket: filters.motherboard.socket.value,
            chipset: filters.motherboard.chipset.value,
            maxMemory: filters.motherboard.maxMemory.noUiSlider.get(),
            supportedDdrType: filters.motherboard.supportedDdrType.value,
            supportedRamSpeed: filters.motherboard.supportedRamSpeed.noUiSlider.get(),
            memorySlots: filters.motherboard.memorySlots.value,
            color: filters.motherboard.color.value
        } : type === 'gpu' ? {
            name: filters.gpu.name.value,
            brand: filters.gpu.brand.value,
            model: filters.gpu.model.value,
            memory: filters.gpu.memory.value,
            gpucoreClock: filters.gpu.gpucoreClock.noUiSlider.get(),
            gpuboostClock: filters.gpu.gpuboostClock.noUiSlider.get(),
            price: filters.gpu.price.noUiSlider.get(),
            tdp: filters.gpu.tdp.noUiSlider.get(),
            length: filters.gpu.tdp.noUiSlider.get()
        } : type === 'case' ? {
            name: filters.case.name.value,
            brand: filters.case.brand.value,
            price: filters.case.price.noUiSlider.get(),
            type: filters.case.type.value,
            color: filters.case.color.value,
            sidepanel: filters.case.sidepanel.value,
            externalVolume: filters.case.externalVolume.noUiSlider.get(),
            internalbays: filters.case.internalbays.value,
            compatibleGpuSize: filters.case.compatibleGpuSize.noUiSlider.get()
        } : type === 'ram' ? {
            name: filters.ram.name.value,
            brand: filters.ram.brand.value,
            price: filters.ram.price.noUiSlider.get(),
            ramSpeed: filters.ram.ramSpeed.noUiSlider.get(),
            modules: filters.ram.modules.value,
            capacity: filters.ram.capacity.value,
            color: filters.ram.color.value,
            casLatency: filters.ram.casLatency.noUiSlider.get(),
            ddrType: filters.ram.ddrType.value
        } : type === 'storage' ? {
            name: filters.storage.name.value,
            brand: filters.storage.brand.value,
            price: filters.storage.price.noUiSlider.get(),
            storageCapacity: filters.storage.storageCapacity.noUiSlider.get(),
            type: filters.storage.type.value,
            cache: filters.storage.cache.value,
            formFactor: filters.storage.formFactor.value,
            interface: filters.storage.interface.value
        } : type === 'psu' ? {
            name: filters.psu.name.value,
            brand: filters.psu.brand.value,
            price: filters.psu.price.noUiSlider.get(),
            type: filters.psu.type.value,
            efficiency: filters.psu.efficiency.value,
            wattage: filters.psu.wattage.noUiSlider.get(),
            modular: filters.psu.modular.value,
            color: filters.psu.color.value
        } : null;
        renderList(filterValues);
    });

    renderList();
}


window.onload = function() {
    if (window.location.pathname.includes('builder.html')) {
        ['cpu', 'motherboard', 'gpu', 'case', 'ram', 'storage', 'psu'].forEach(type => {
            const selected = localStorage.getItem(`selected-${type}`);
            if (selected) {
                document.getElementById(`selected-${type}`).textContent = selected || 'None';
            }
        });
    }
};

function checkCompatibility(componentsData) {
    const selectedCpu = localStorage.getItem('selected-cpu');
    const selectedMotherboard = localStorage.getItem('selected-motherboard');
    const selectedGpu = localStorage.getItem('selected-gpu');
    const selectedCase = localStorage.getItem('selected-case');
    const selectedRam = localStorage.getItem('selected-ram');
    const selectedStorage = localStorage.getItem('selected-storage');
    const selectedPsu = localStorage.getItem('selected-psu');

    let compatibilityMessages = [];

    if (!selectedCpu && !selectedMotherboard && !selectedGpu && !selectedCase && !selectedRam && !selectedStorage && !selectedPsu) {
        compatibilityMessages.push("No components selected");
    } else {
        if (selectedCpu && selectedMotherboard) {
        const cpuData = componentsData.cpu.find(cpu => cpu.cpuname === selectedCpu);
        const motherboardData = componentsData.motherboard.find(mb => mb.mbname === selectedMotherboard);

        if (cpuData.cpusocket !== motherboardData.mbsocket) {
            compatibilityMessages.push("CPU socket type does not match the motherboard socket type.");
        }
        if (!cpuData.chipsets.includes(motherboardData.chipset)) {
            compatibilityMessages.push("Motherboard chipset is not compatible with the CPU.");
        }
    }

    if (selectedRam && selectedMotherboard) {
        const ramData = componentsData.ram.find(ram => ram.ramname === selectedRam);
        const motherboardData = componentsData.motherboard.find(mb => mb.mbname === selectedMotherboard);

        if (ramData.ddr_type !== motherboardData.supported_ddr_type) {
            compatibilityMessages.push("RAM type does not match the motherboard specifications.");
        } 
        if (ramData.capacity > motherboardData.maxmemory) {
            compatibilityMessages.push("RAM capacity exceeds the maximum supported memory of the motherboard.");
        }
        if (ramData.speed > motherboardData.supported_ram_speed) {
            compatibilityMessages.push("RAM speed is not supported by the motherboard.");
        }
    }

    if (selectedMotherboard && selectedCase) {
       const motherboardData = componentsData.motherboard.find(mb => mb.mbname === selectedMotherboard);
       const caseData = componentsData.case.find(pccase => pccase.casename === selectedCase);

       const incompatibleMotherboardFormFactors = {
           "XL ATX": ["ATX Mid Tower", "MicroATX Mini Tower", "MicroATX Mid Tower", "Mini ITX Desktop"],
           "ATX": ["MicroATX Mini Tower", "MicroATX Mid Tower", "Mini ITX Desktop"],
           "Micro ATX": ["Mini ITX Desktop"],
        };

        const isCompatible = !incompatibleMotherboardFormFactors[motherboardData.mbformfactor].includes(caseData.casetype);

        if (!isCompatible) {
        compatibilityMessages.push("Motherboard form factor does not fit within the case form factor.");
       }
    }

    if (selectedGpu && selectedCase) {
        const gpuData = componentsData.gpu.find(gpu => gpu.gpuname === selectedGpu);
        const caseData = componentsData.case.find(pccase => pccase.casename === selectedCase);

        if (gpuData.length > caseData.compatible_gpu_size) {
            compatibilityMessages.push("GPU length exceeds the maximum GPU length supported by the case.");
        }
    }

    if (selectedCpu && selectedGpu && selectedPsu) {
        const cpuData = componentsData.cpu.find(cpu => cpu.cpuname === selectedCpu);
        const gpuData = componentsData.gpu.find(gpu => gpu.gpuname === selectedGpu);
        const psuData = componentsData.psu.find(psu => psu.psuname === selectedPsu);

        const requiredWattage = cpuData.tdp + gpuData.tdp;
        if (psuData.wattage < requiredWattage) {
            compatibilityMessages.push("PSU wattage is less than the required wattage for the GPU and CPU.");
        }
    }

    if (selectedStorage && selectedMotherboard) {
        const storageData = componentsData.storage.find(storage => storage.storagename === selectedStorage);
        const motherboardData = componentsData.motherboard.find(mb => mb.mbname === selectedMotherboard);

        const storageInterface = storageData.interface;
        const isCompatible = motherboardData.supportedinterfaces.some(supportedInterface => {
            return storageInterface.includes(supportedInterface);
        });

        if (!isCompatible) {
            compatibilityMessages.push("Storage interface does not match the motherboard's supported interfaces.");
        }
    }
}
    const compatibilityResults = document.getElementById("compatibility-results");
    compatibilityResults.innerHTML = compatibilityMessages.length > 0 ? compatibilityMessages.join('<br>') : "All selected components are compatible.";
}
