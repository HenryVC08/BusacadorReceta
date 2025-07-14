
function iniciarApp() {

    const selectCatergorias = document.querySelector('#categorias')
    selectCatergorias.addEventListener('change', seleccionarCategoria)

    const resultado = document.querySelector('#resultado')
    const modal = new bootstrap.Modal('#modal', {})

    obtenerCategorias()





    function obtenerCategorias() {
        const url = 'https://www.themealdb.com/api/json/v1/1/categories.php'

        fetch(url)
            .then(respuesta => {
                return respuesta.json()
            })
            .then(resultado => {
                mostrarCategorias(resultado.categories)
            })

    }

    function mostrarCategorias(categorias = []) {
        categorias.forEach(categoria => {

            const { strCategory } = categoria

            const option = document.createElement('OPTION')
            option.value = strCategory
            option.textContent = strCategory
            selectCatergorias.appendChild(option)
            // console.log(option)

            // console.log(categoria)
        })
    }

    function seleccionarCategoria(e) {
        const categoria = e.target.value
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`
        fetch(url)
            .then(respuesta => {
                return respuesta.json()
            })
            .then(resultado => {
                mostrarRecetas(resultado.meals)
            })


        // console.log(url)
    }




    function mostrarRecetas(recetas = []) {


        limpiarHTML(resultado);

        const heading = document.createElement('H2');
        heading.classList.add('text-center', 'text-black', 'my-5')
        heading.textContent = recetas.length ? 'Resultados' : 'No hay resultados';
        resultado.appendChild(heading)


        //Iterar en los resultados

        recetas.forEach(receta => {

            const { idMeal, strMeal, strMealThumb } = receta

            const recetaContenedor = document.createElement('DIV')
            recetaContenedor.classList.add('col-md-4')


            const recetaCard = document.createElement('DIV')
            recetaCard.classList.add('card', 'mb-4')

            const recetaImagen = document.createElement('IMG')
            recetaImagen.classList.add('card-img-top')
            recetaImagen.alt = `Imagen de la receta  ${strMeal}`
            recetaImagen.src = strMealThumb

            const recetCardBody = document.createElement('DIV')
            recetCardBody.classList.add('card-body')


            const recetaHeading = document.createElement('H3')
            recetaHeading.classList.add('card-title', 'mb-3')
            recetaHeading.textContent = strMeal


            const recetaButton = document.createElement('BUTTON')
            recetaButton.classList.add('btn', 'btn-danger', 'w-100')
            recetaButton.textContent = 'Ver receta'
            // recetaButton.dataset.bsTarget = "#modal"
            // recetaButton.dataset.bsToggle = 'modal'
            recetaButton.onclick = function () {
                seleccionarReceta(idMeal)
            }



            //Inyectar en el codigo HTML
            recetCardBody.appendChild(recetaHeading)
            recetCardBody.appendChild(recetaButton)

            recetaCard.appendChild(recetaImagen)
            recetaCard.appendChild(recetCardBody)


            recetaContenedor.appendChild(recetaCard)

            resultado.appendChild(recetaContenedor)

            console.log(recetaHeading)

        })
    }

    function seleccionarReceta(id) {
        // console.log(id)
        const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(resultado => mostrarRecetaModal(resultado.meals[0]))


    }

    function mostrarRecetaModal(receta) {
        //muestra el modal 
        const { idMeal, strInstructions, strMeal, strMealThumb } = receta;

        const modalTitle = document.querySelector('.modal .modal-title')
        const modalBody = document.querySelector('.modal .modal-body')

        modalTitle.textContent = strMeal;

        modalBody.innerHTML = `
            <img class="img-fluid" src="${strMealThumb}" alt="receta ${strMeal}" />
            <h3 class="my-3">Instrucciones</h3>
            <p>${strInstructions}</p>
            <h3 class="my-3">Ingredientes y cantidades</h3>
        `

        const listGroup = document.createElement('UL')
        listGroup.classList.add('list-group')
        //Mostrar CAntidades 


        for(let i=1; i<=20;i++){

            // console.log(receta[`strIngredient${i}`])

            if(receta[`strIngredient${i}`]){

                // console.log(receta[`strIngredient${i}`])
                const ingrediente = receta[`strIngredient${i}`]
                const cantidad = receta[`strMeasure${i}`]

                const ingredienteLi = document.createElement('LI')
                ingredienteLi.classList.add ('list-group-item')
                ingredienteLi.textContent = `${ingrediente} - ${cantidad}`

                listGroup.appendChild(ingredienteLi)
                console.log()
            }
        }

        modalBody.appendChild(listGroup)

        // console.log(receta)
        modal.show()
    }


    function limpiarHTML(selector) {
        while (selector.firstChild) {
            selector.removeChild(selector.firstChild);
        }
    }

}

document.addEventListener('DOMContentLoaded', iniciarApp)