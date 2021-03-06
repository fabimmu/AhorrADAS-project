$('#btn-ocultar-filtros').addEventListener('click', () => {
    const filterText = $('#btn-ocultar-filtros').innerText
    if (filterText === 'Ocultar filtros') {
      $('#filtros-opciones').classList.add('is-hidden')
      $('#btn-ocultar-filtros').textContent = 'Mostrar filtros'
    } else {
      $('#filtros-opciones').classList.remove('is-hidden')
      $('#btn-ocultar-filtros').textContent = 'Ocultar filtros'
    }
  })
  
  $('#btn-limpiar-filtros').addEventListener('click', () => {
    const data = getStorage()
    const { operations } = data
    loadOperations(operations)
  })
  
  
  $('#btn-Nueva-Op').addEventListener('click', () => {
    $('#section_nueva_operacion').classList.remove('is-hidden')
    $('#sectionInicio').classList.add('is-hidden')
  })
  $('#btn-new-op-cancelar').addEventListener('click', () => {
    $('#section_nueva_operacion').classList.add('is-hidden')
    $('#sectionInicio').classList.remove('is-hidden')
  })
  
  /************************
   * Get Date
   ************************/
  $('#filtro_fecha').valueAsDate = new Date()
  $('#new-op-date').valueAsDate = new Date()
  /************************
   * Balances
   ************************/
  const data = getStorage()
  updateData(data)
  
  let balanceGasto = 0
  let balanceGanancia = 0
  let balanceTotal = 0
  $('#negativeAmount').innerHTML = '-' + balanceGasto
  $('#positiveAmount').innerText = '+' + balanceGanancia
  $('#totalAmount').innerHTML = balanceTotal
  const loadBalances = () => {
    const data = getStorage()
    for (let operation of data.operations) {
      if (operation.type == 'gasto') {
        balanceGasto = balanceGasto - Number(operation.amount)
        $('#negativeAmount').innerHTML = balanceGasto
      } else {
        balanceGanancia = balanceGanancia + Number(operation.amount)
        $('#positiveAmount').innerHTML = balanceGanancia
      }
      balanceTotal = balanceGanancia + balanceGasto
      $('#totalAmount').innerHTML = balanceTotal
    }
  }
  loadBalances()
  
  /************************
   * LOADING SELECT OPTIONS
   ************************/
  const loadSelectOptions = () => {
    const { categories } = getStorage()
    let selectCategoriesFilter = document.getElementById('selectCategories')
    let selectCategoriesOperation = document.getElementById('new-op-category')
    let selectCategoriesEditOperation = document.getElementById('editOpCategory')
  
    for (let category of categories) {
      let categoryOptionsFilter = document.createElement('option')
      let categoryOptionsOperation = document.createElement('option')
      let categoryOptionsEditOperation = document.createElement('option')
  
      categoryOptionsFilter.value = category.name
      categoryOptionsFilter.innerText = category.name
      categoryOptionsFilter.style.textTransform = 'uppercase'
  
      categoryOptionsOperation.value = category.name
      categoryOptionsOperation.innerText = category.name
      categoryOptionsOperation.style.textTransform = 'uppercase'
  
      categoryOptionsEditOperation.value = category.name
      categoryOptionsEditOperation.innerText = category.name
      categoryOptionsEditOperation.style.textTransform = 'uppercase'
  
      selectCategoriesFilter.appendChild(categoryOptionsFilter)
      selectCategoriesOperation.appendChild(categoryOptionsOperation)
      selectCategoriesEditOperation.appendChild(categoryOptionsEditOperation)
    }
  }
  loadSelectOptions()
  /*New Operation*/
  const addNewOperation = () => {
    const data = getStorage()
  
    /*Postear al LocalStorage*/
    let nameOperation = $('#new-op-description').value
    let amountOperation = $('#new-op-amount').value
    let typeOperation = $('#new-op-type').value
    let categoryOperation = $('#new-op-category').value
    let dateOperation = $('#new-op-date').value
  
    if (nameOperation === '' || dateOperation === '' || amountOperation === '') {
      swalEmpty()
    } else {
      const newOperation = {
        id: uuidv4(),
        name: nameOperation,
        amount: amountOperation,
        type: typeOperation,
        category: categoryOperation,
        date: dateOperation,
      }
      data.operations.push(newOperation)
      updateData(data)
  
      swalCreate()
      loadOperations(data)
    }
  }
  $('#btn-new-op-agregar').addEventListener('click', () => {
    $('#section_nueva_operacion').classList.add('is-hidden')
    $('#sectionInicio').classList.remove('is-hidden')
    $('#img-new-op-blankbox').classList.add('is-hidden')
    $('#operations-table').classList.remove('is-hidden')
    addNewOperation()
  })
  /************************
   * Edit Operation
   ************************/
  const editOperation = (e) => {
    const data = getStorage()
  
    const id_operationToEdit = e.target.dataset.id
    const operationToEdit = data.operations.find(
      (x) => x.id === id_operationToEdit,
    )
  
    $('#sectionEditarOperacion').classList.remove('is-hidden')
    $('#sectionInicio').classList.add('is-hidden')
  
    $('#editOpDescription').value = operationToEdit.name
    // $("#editOpDescription").setAttribute("value", name_operationToEdit);
    $('#editOpDescription').dataset.id = operationToEdit.id
  
    $('#editOpAmount').value = operationToEdit.amount
    // $("#editOpAmount").setAttribute("value", operationToEdit.amount);
  
    $('#editOptype').value = operationToEdit.type
  
    $('#editOpCategory').value = operationToEdit.category
  
    $('#editOpDate').value = operationToEdit.date
  }
  
  $('#btnSubmitEditOp').addEventListener('click', () => {
    const data = getStorage()
  
    const newNameOperation = $('#editOpDescription').value
    const newAmountOperation = $('#editOpAmount').value
    const newTypeOperation = $('#editOptype').value
    const newCategoryOperation = $('#editOpCategory').value
    const newDateOperation = $('#editOpDate').value
  
    const index = data.operations.findIndex(
      (x) => x.id === $('#editOpDescription').dataset.id,
    )
  
    data.operations[index].name = newNameOperation
    data.operations[index].amount = newAmountOperation
    data.operations[index].type = newTypeOperation
    data.operations[index].category = newCategoryOperation
    data.operations[index].date = newDateOperation
  
    updateData(data)
    loadOperations(data)
  
    $('#sectionEditarOperacion').classList.add('is-hidden')
    $('#sectionInicio').classList.remove('is-hidden')
  })
  
  $('#btnCancelEditOp').addEventListener('click', () => {
    $('#sectionEditarOperacion').classList.add('is-hidden')
    $('#sectionInicio').classList.remove('is-hidden')
  })
  /************************
   * Remove Operation
   ************************/
  const removeOperation = (e) => {
    const data = getStorage()
    const id_operationToRemove = e.target.dataset.id
    const remainingOperations = data.operations.filter(
      (operation) => operation.id !== id_operationToRemove,
    )
    updateData({ ...data, operations: remainingOperations })
    loadOperations(data)
  }
  /************************
   * Load Operation
   ************************/
  const loadOperations = (data) => {
    let operationsTableBody = document.getElementById('operations-table-body')
    operationsTableBody.innerHTML = ''
    for (let operation of data) {
      let rowOperation = document.createElement('tr')
      let dataRowOpDescription = document.createElement('td')
      let dataRowOpCategory = document.createElement('td')
      let dataRowOpDate = document.createElement('td')
      let dataRowOpAmount = document.createElement('td')
      dataRowOpDescription.innerText = operation.name
      dataRowOpCategory.innerText = operation.category
      dataRowOpDate.innerText = operation.date
      dataRowOpAmount.innerText = operation.amount
      dataRowOpAmount.style.fontWeight = 'bold'
  
      if (operation.type == 'gasto') {
        dataRowOpAmount.innerText = '- ' + operation.amount
        dataRowOpAmount.style.color = '#f14668'
      } else {
        dataRowOpAmount.innerText = '+ ' + operation.amount
        dataRowOpAmount.style.color = '#48c78e'
      }
  
      let BtnsBoxTable = document.createElement('div')
      let btnEditTable = document.createElement('button')
      let btnRemoveTable = document.createElement('button')
      rowOperation.setAttribute('class', 'has-text-centered')
      BtnsBoxTable.setAttribute(
        'class',
        'column in-line has-text-centered is-centered',
      )
      btnEditTable.setAttribute('class', 'button is-warning m-1')
      btnEditTable.setAttribute('id', 'btnEditOperation')
      btnRemoveTable.setAttribute('class', 'button is-danger m-1')
      btnRemoveTable.setAttribute('id', 'btnRemoveOperation')
      btnEditTable.innerText = 'Editar'
      btnRemoveTable.innerText = 'Eliminar'
      btnEditTable.addEventListener('click', editOperation)
      btnRemoveTable.addEventListener('click', removeOperation)
      btnEditTable.dataset.id = operation.id
      btnRemoveTable.dataset.id = operation.id
      BtnsBoxTable.appendChild(btnEditTable)
      BtnsBoxTable.appendChild(btnRemoveTable)
  
      rowOperation.appendChild(dataRowOpDescription)
      rowOperation.appendChild(dataRowOpCategory)
      rowOperation.appendChild(dataRowOpDate)
      rowOperation.appendChild(dataRowOpAmount)
      rowOperation.appendChild(BtnsBoxTable)
  
      operationsTableBody.appendChild(rowOperation)
    }
  }
  
  const viewOperations = () => {
    const data = getStorage()
    const { operations } = data
    if (data.operations.length > 0) {
      $('#img-new-op-blankbox').classList.add('is-hidden')
      $('#operations-table').classList.remove('is-hidden')
      loadOperations(operations)
    } else {
      $('#img-new-op-blankbox').classList.remove('is-hidden')
      $('#operations-table').classList.add('is-hidden')
    }
  }
  viewOperations()