    const geroes = document.querySelector('.geroes__wrapper');
    const select = document.querySelector('.header__select');
    const selectData = new Set()
    let base = [];

    fetch('../base/dbHeroes.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => base.push(item))
            setSelect(base)
            render(base)
        })

    
    const render = data => {
        geroes.innerHTML = ''
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
        })
    }

    const setSelect = data => {
       data.forEach(item => {
           if (item.movies){
            item.movies.forEach(film => selectData.add(film))
           }
       })

       for (let key of selectData){
           const option = `<option value="${key}">${key}</option>`;
           select.insertAdjacentHTML('beforeend', option)
       }
    }

    select.addEventListener('change', () => {
        if (select.value === 'default'){
            render(base)
        } else {
            render(base.filter(item => {
                if (item.movies){
                    return item.movies.includes(select.value)
                }
            }))
        }
    })

    