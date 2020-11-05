'use strict'

class DragZone {
  constructor() {
    this.isOnColumn = false
    this.dragzone = null
  }

  createDragZone() {
    let dragzone = document.createElement('div')
    let column = document.createElement('div')
    dragzone.classList.add('dragzone')
    column.classList.add('column')

    column.innerHTML = `
  <div class="message">
       Hello
  </div>
  <div class="message">
       Jack
  </div>`

    dragzone.insertAdjacentHTML(
      'afterbegin',
      `
 ${column.outerHTML}
 ${column.outerHTML}
  `
    )
    dragzone.ondragstart = function () {
      return false
    }
    this.dragzone = dragzone
    this.column = column
    document.body.append(dragzone)
  }
}
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
class Draggable extends DragZone {
  constructor(isOnColumn, dragzone) {
    super(isOnColumn, dragzone)
  }

  listeners() {
    this.dragzone.addEventListener('mousedown', (e) =>
      this.dragAndDrop.call(this, [e])
    )
    this.dragzone.addEventListener('mouseover', this.dragOver)
    this.dragzone.addEventListener('mouseout', this.dragOut, true)
  }

  dragAndDrop([e] = args) {
    if (e.target.className != 'message') return

    let shiftX = e.clientX - e.target.getBoundingClientRect().left
    let shiftY = e.clientY - e.target.getBoundingClientRect().top
    let elemBelow = null

    const moveAt = (pageX, pageY) => {
      e.target.style.left = pageX - shiftX + 'px'
      e.target.style.top = pageY - shiftY + 'px'
      e.target.hidden = true
      elemBelow = document.elementFromPoint(pageX, pageY)
      e.target.hidden = false
      if (elemBelow.className != 'column') this.isOnColumn = false
      else this.isOnColumn = true
      console.log(elemBelow)
    }

    moveAt(e.pageX, e.pageY)
    e.target.style.position = 'absolute'
    e.target.style.zIndex = 1000

    const onMouseMove = (e) => moveAt(e.pageX, e.pageY)

    document.addEventListener('mousemove', onMouseMove)

    e.target.addEventListener('mouseup', () =>
      this.onMouseUp.call(this, [e, elemBelow, onMouseMove])
    )
  }

  onMouseUp([e, elemBelow, onMouseMove] = args) {
    e.target.style.position = null
    if (this.isOnColumn) elemBelow.append(e.target)
    if (e.target) document.removeEventListener('mousemove', onMouseMove)

    e.target.style.left = null
    e.target.style.top = null
    e.target.onmouseup = null
    console.log('Mouse Upped')
  }

  dragOver(e) {
    switch (e.target.className) {
      case 'message':
        break

      case 'column':
        this.isOnColumn = true
        break
    }
    console.log(this.isOnColumn)
  }
  dragOut(e) {
    switch (e.target.className) {
      case 'message':
        break

      case 'column':
        if (e.relatedTarget.className != 'message') this.isOnColumn = false
        break
    }
    console.log(this.isOnColumn)
  }
}

let dragzonee = new Draggable()
dragzonee.createDragZone()
dragzonee.listeners()
