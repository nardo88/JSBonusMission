    const geroes = document.querySelector('.geroes__wrapper');
    const select = document.querySelector('.controls__select');
    const goTop = document.querySelector('.goTop');
    const overlay = document.querySelector('.overlay');
    const showTrailer = document.querySelector('.show-trailer');
    const trailer = document.querySelector('.trailer');
    const overlayTrayler = document.querySelector('.overlay-trayler');
    const play = document.querySelector('.play');
    const stop = document.querySelector('.stop');
    const videoPlayer = document.querySelector('.video-player');
    const videoProgress = document.querySelector('.video-progress')
    const videoTimePassed = document.querySelector('.video-time__passed')
    const videoTimeTotal = document.querySelector('.video-time__total')
    const videoVolume = document.querySelector('.video-volume')
    const faVolumeDown = document.querySelector('.fa-volume-down')
    const selectData = new Set()
    let base = [];

    fetch('./base/dbHeroes.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => base.push(item))
            setSelect(base)
            render(base)
        })

    const togleTrailer = () => {
        overlayTrayler.classList.toggle('flex')
        trailer.classList.toggle('open')
        resetPlayer()
    }

    const togglePlay = () => {
        if (videoPlayer.paused) {
            videoPlayer.play()
        } else {
            videoPlayer.pause()
        }
    }
    const stopPlay = () => {
        videoPlayer.pause()
        videoPlayer.currentTime = 0
    }

    const toggleIcon = () => {
        if (videoPlayer.paused) {
            play.classList.remove('fa-pause')
            play.classList.add('fa-play')

        } else {
            play.classList.add('fa-pause')
            play.classList.remove('fa-play')
        }
    }

    const addZero = (n) => n < 10 ? '0' + n : n




    const render = data => {
        overlay.style.display = 'flex';
        geroes.innerHTML = ''
        setTimeout(() => {
            data.forEach(item => {

                let films = item.movies ? item.movies.join(', ') : ''
                const card = document.createElement('div');
                card.classList.add('geroes__item');
                card.innerHTML = `
                <div class="geroes__image">
                <img src="./base/${item.photo}" alt="photo">
                </div>
            
                <div class="geroes__info">
                    <h2 class="geroes__title">${item.name}</h2>
                    ${item.realName ? `<span class="geroes__real-name"><span class="geroes__category">Настоящее имя:</span> ${item.realName}</span>` : ''}
                    <span class="geroes__species"><span class="geroes__category">Раса:</span> ${item.species}</span>
                    ${ item.citizenship ? `<span class="geroes__citizenship"><span class="geroes__category">Национальность:</span> ${item.citizenship}</span>` : ''}
                    <span class="geroes__gender"><span class="geroes__category">Пол:</span> ${item.gender}</span>
                    ${item.birthDay ? `<span class="geroes__birthDay"><span class="geroes__category">Год рождения:</span> ${item.birthDay}</span>` : '' }
                    ${item.deathDay ? ` <span class="geroes__birthDay"><span class="geroes__category">Год смерти:</span> ${item.deathDay}</span>` : ''}
                    <span class="geroes__status"><span class="geroes__category">Статус:</span> ${item.status}</span>
                    <span class="geroes__actors"><span class="geroes__category">Актер:</span> ${item.actors}</span>
                    <div class="films">Участие в фильмах</div>
                    <p class="geroes__films">${films ? films : 'Не введен в КВМ'}</p>
                </div>
                `;
                geroes.insertAdjacentElement('afterbegin', card)
                overlay.style.display = 'none';
            })
        }, 400)

    }

    const setSelect = data => {
        data.forEach(item => {
            if (item.movies) {
                item.movies.forEach(film => selectData.add(film))
            }
        })

        for (let key of selectData) {
            const option = `<option value="${key}">${key}</option>`;
            select.insertAdjacentHTML('beforeend', option)
        }
    }

    const resetPlayer = () => {
        videoProgress.value = 0
        videoTimeTotal.textContent = '00:00'
        videoPlayer.currentTime = 0
    }

    select.addEventListener('change', () => {
        if (select.value === 'default') {
            render(base)
            videoPlayer.src = `./tralers/default.mp4`

        } else {
            render(base.filter(item => {
                if (item.movies) {
                    return item.movies.includes(select.value)
                }
            }))
            let path = select.value.replace(/:/, '')
            videoPlayer.src = `./tralers/${path}.mp4`
        }
        resetPlayer();
    })

    document.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            goTop.classList.add('visible')
        } else {
            goTop.classList.remove('visible')

        }
    })

    goTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    })

    showTrailer.addEventListener('click', togleTrailer)
    overlayTrayler.addEventListener('click', () => {
        stopPlay();
        togleTrailer();
    })


    play.addEventListener('click', () => {
        togglePlay()
    })

    videoPlayer.addEventListener('click', () => {
        togglePlay()
    })

    videoPlayer.addEventListener('play', toggleIcon)
    videoPlayer.addEventListener('pause', toggleIcon)
    stop.addEventListener('click', stopPlay)

    videoPlayer.addEventListener('timeupdate', () => {
        const currentTime = videoPlayer.currentTime
        const duration = videoPlayer.duration

        let minutePassed = Math.floor(currentTime / 60)
        let secondsPassed = Math.floor(currentTime % 60)

        let minuteTotal = Math.floor(duration / 60)
        let secondsTotal = Math.floor(duration % 60)

        videoProgress.value = (currentTime / duration) * 100

        videoTimePassed.textContent = `${addZero(minutePassed)}:${addZero(secondsPassed)}`
        videoTimeTotal.textContent = `${addZero(minuteTotal)}:${addZero(secondsTotal)}`
    })

    videoProgress.addEventListener('input', () => {
        const duration = videoPlayer.duration
        const value = videoProgress.value

        videoPlayer.currentTime = (value * duration) / 100
    })

    videoVolume.addEventListener('input', () => {
        videoPlayer.volume = videoVolume.value / 100
    })

    videoPlayer.volume = 0.5

    videoVolume.value = videoPlayer.volume * 100

    const changeVolume = (val) => {
        videoPlayer.volume = val / 100
        videoVolume.value = val
    }

    let videoVolumeValue

    faVolumeDown.addEventListener('click', () => {

        if (videoPlayer.volume != 0) {
            videoVolumeValue = videoVolume.value
            changeVolume(0)

        } else {
            changeVolume(videoVolumeValue)
        }
    })


    const slider = () => {
        const slide = document.querySelectorAll('.slider__item');
        const slider = document.querySelector('.slider__content');
        const sliderDots = document.querySelector('.slider__dots');
        // добавление dot в слайдер
        for (let i = 0; i < slide.length; i++) {
            const dotItem = document.createElement('li');
            dotItem.classList.add('slider__dot');
            sliderDots.insertAdjacentElement('afterbegin', dotItem);
        };
        // только затем получаем все dot
        const dot = document.querySelectorAll('.slider__dot');
        // и первому даем активный класс
        dot[0].classList.add('slider__dot--active');

        let currentSlide = 0,
            interval;

        const prevSlide = (elem, index, strClass) => {
            elem[index].classList.remove(strClass);
        };

        const nextSlide = (elem, index, strClass) => {
            elem[index].classList.add(strClass);
        };

        const stopSlide = () => {
            clearInterval(interval);
        };


        const autoPlaySlide = () => {
            prevSlide(slide, currentSlide, 'slider__item--active');
            prevSlide(dot, currentSlide, 'slider__dot--active');

            currentSlide++;

            if (currentSlide >= slide.length) {
                currentSlide = 0;
            };

            nextSlide(slide, currentSlide, 'slider__item--active');
            nextSlide(dot, currentSlide, 'slider__dot--active');

        };

        const startSlide = (time = 1500) => {
            interval = setInterval(autoPlaySlide, time);
        };

        sliderDots.addEventListener('mouseover', e => {
            if (e.target.matches('.slider__dot')) {
                stopSlide();
            };
        });

        sliderDots.addEventListener('mouseout', e => {
            if (e.target.matches('.slider__dot')) {
                startSlide(2000);
            };
        });

        sliderDots.addEventListener('click', (e) => {
            const target = e.target;

            if (!target.matches('.slider__dot')) {
                return;
            };

            prevSlide(slide, currentSlide, 'slider__item--active');
            prevSlide(dot, currentSlide, 'slider__dot--active');

            if (e.target.matches('.slider__dot')) {
                dot.forEach((item, i) => {
                    if (item === target) {
                        currentSlide = i;


                    };
                });

                console.log(currentSlide);


                nextSlide(slide, currentSlide, 'slider__item--active');
                nextSlide(dot, currentSlide, 'slider__dot--active');
            }
        })

        startSlide(2000)


    }

    slider()