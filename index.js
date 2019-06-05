// TAKEAWAYS
// to create viz with canvas, two steps are required: 1) bind the data 2) draw the viz

// set up variables
let width = 350,
  height = 350

let globalLifeSpan = 72

let groupSpacing = 4,
  cellSpacing = 1.5,
  offsetTop = height / 5,
  cellSize = 3

let diagramYTranslate = 40

// initial call to functions to bind data and draw rectangle elements
update(createData(globalLifeSpan), '#current-century-diagram', { name: '', years: 0, birthExpectancy: 0, adultExpectancy: 0 }, 'diagram')

// 16th to 18th century
update(createData(globalLifeSpan), '#earlier-century-average', { name: '', years: 0, birthExpectancy: 40, adultExpectancy: 59 }, 'average-life-span')

// pocahontas
update(createData(globalLifeSpan), '#pocahontas', { name: 'Pocahontas', years: 20, birthExpectancy: 40, adultExpectancy: 59 }, 'single-life-span')

// sir isaac newton
update(createData(84), '#sir-isaac-newton', { name: 'Sir Isaac Newton', years: 84, birthExpectancy: 40, adultExpectancy: 59 }, 'single-life-span')

// 17th century
update(createData(globalLifeSpan), '#seventeeth-century-pocahontas', { name: 'Pocahontas', years: 20, birthExpectancy: 40, adultExpectancy: 59 }, 'multiple-life-span')
update(createData(84), '#seventeeth-century-newton', { name: 'Sir Isaac Newton', years: 84, birthExpectancy: 40, adultExpectancy: 59 }, 'multiple-life-span')
update(createData(83), '#seventeeth-century-voltaire', { name: 'Voltaire', years: 83, birthExpectancy: 40, adultExpectancy: 59 }, 'multiple-life-span')
update(createData(77), '#seventeeth-century-galilei', { name: 'Galileo Galilei', years: 77, birthExpectancy: 40, adultExpectancy: 59 }, 'multiple-life-span')
update(createData(globalLifeSpan), '#seventeeth-century-bathory', { name: 'Elizabeth Bathory', years: 54, birthExpectancy: 40, adultExpectancy: 59 }, 'multiple-life-span')

// 18th century 
update(createData(86), '#eighteenth-century-sojourner', { name: 'Sojourner Truth', years: 86, birthExpectancy: 40, adultExpectancy: 59 }, 'multiple-life-span')
update(createData(globalLifeSpan), '#eighteenth-century-jane', { name: 'Jane Austen', years: 41, birthExpectancy: 40, adultExpectancy: 59 }, 'multiple-life-span')
update(createData(globalLifeSpan), '#eighteenth-century-mary', { name: 'Mary Wollstonecraft', years: 38, birthExpectancy: 40, adultExpectancy: 59 }, 'multiple-life-span')

// 20th century comparisons
update(createData(globalLifeSpan), '#earlier-century-compare', { name: '', years: 0, birthExpectancy: 40, adultExpectancy: 59 }, 'average-life-span')
update(createData(globalLifeSpan), '#early-twentieth-century-compare', { name: '', years: 0, birthExpectancy: 31 }, 'average-life-span')
update(createData(globalLifeSpan), '#mid-twentieth-century-compare', { name: '', years: 0, birthExpectancy: 48 }, 'average-life-span')
update(createData(globalLifeSpan), '#current-century-compare', { name: '', years: 0, birthExpectancy: 71 }, 'average-life-span') // 71 is the 72nd year, because the grid rows start from 0

// 20th century
update(createData(92), '#twentieth-century-rosa', { name: 'Rosa Parks', years: 92, birthExpectancy: 48 }, 'multiple-life-span')
update(createData(globalLifeSpan), '#twentieth-century-walt', { name: 'Walt Disney', years: 65, birthExpectancy: 48 }, 'multiple-life-span')
update(createData(84), '#twentieth-century-thomas', { name: 'Thomas Edison', years: 84, birthExpectancy: 48 }, 'multiple-life-span')
update(createData(globalLifeSpan), '#twentieth-century-eva', { name: 'Eva Perón', years: 33, birthExpectancy: 48 }, 'multiple-life-span')
update(createData(87), '#twentieth-century-elie', { name: 'Elie Wiesel', years: 87, birthExpectancy: 48 }, 'multiple-life-span')
update(createData(76), '#twentieth-century-stephen', { name: 'Stephen Hawking', years: 76, birthExpectancy: 48 }, 'multiple-life-span')
update(createData(84), '#twentieth-century-salvador', { name: 'Salvador Dalí', years: 84, birthExpectancy: 48 }, 'multiple-life-span')
update(createData(globalLifeSpan), '#twentieth-century-rachel', { name: 'Rachel Carson', years: 56, birthExpectancy: 48 }, 'multiple-life-span')

function createData(years) {
  let data = []

  // create the initial set of data points
  // 4160 = globalLifeSpan * 52 (the average US lifespan in weeks)
  d3.range(years * 52).forEach((el, index) => {
    let y0 = Math.floor(index / 52) * (cellSize + cellSpacing)
    let x0 = ((cellSize + cellSpacing) * index) - (52 * (cellSize + cellSpacing) * (y0 / (cellSize + cellSpacing)))

    data.push({
      value: el,
      x: x0,
      y: y0,
      sourceX: x0,
      sourceY: y0,
      targetX: x0,
      targetY: y0
    })
  })

  return data
}

function createDataMultiple(years, lifeSpanCount) {
  let data = [],
    lifeSpanSpacing = 125

  d3.range(years * 52 * lifeSpanCount).forEach((el, index) => {
    let y0 = Math.floor(index / 52) * (cellSize + cellSpacing)
    let x0 = ((cellSize + cellSpacing) * index) - (52 * y0) + (Math.floor(index / (globalLifeSpan * 52)) * lifeSpanSpacing)

    data.push({
      value: el,
      x: x0,
      y: y0,
      sourceX: x0,
      sourceY: y0 - (Math.floor(index / (globalLifeSpan * 52)) * 160),
      targetX: x0,
      targetY: y0 - (Math.floor(index / (globalLifeSpan * 52)) * 160)
    })
  })

  return data
}

function update(data, container, lifeSpan, type) {
  // set up the canvas by attaching it to the div container
  let canvas = d3.select(container)
    .append('canvas')
    .attr('height', height)

  // add the tools that canvas needs to draw shapes!
  let context = canvas.node().getContext('2d')

  // equivalent to defining an svg element in d3
  let customBase = document.createElement('custom')
  let custom = d3.select(customBase)

  databind(data, custom, lifeSpan, type) // bind the data

  let timer = d3.timer(elapsed => { // using d3.timer allows transitions to be shown
    draw(custom, context, lifeSpan, type) // draw onto the canvas context using d3.timer
    if (elapsed > 1000) { timer.stop() }
  })
}

function databind(data, custom, lifeSpan, type) {
  // let colourScale = d3.scaleSequential(d3.interpolateBrBG)
  //   .domain(d3.extent(data, d => d.value))

  // bind the data
  let join = custom.selectAll('custom.rect')
    .data(data)

  // append elements
  let enterSel = join.enter()
    .append('custom')
    .attr('class', 'rect')
    .attr('x', (d, i) => {
      return d.sourceX
    })
    .attr('y', (d, i) => {
      if (type === 'diagram') return d.sourceY + diagramYTranslate
      if (type === 'single-life-span' || type === 'multiple-life-span' || type === 'average-life-span') return d.sourceY
    })
    .attr('width', 0)
    .attr('height', 0)
    .attr('fillStyle', (d, i) => {
      // diagram
      if (type === 'diagram') {
        if (i === 546) return '#F98AB7'
        if (i >= 0 && i < 52 ) return '#F98AB7'
        else return '#C7C6C5'
      }

      // life spans
      if (type === 'single-life-span' || type === 'multiple-life-span') {
        if (lifeSpan.years > globalLifeSpan) {
          if (i >= (lifeSpan.years - lifeSpan.birthExpectancy) * 52 && i < (lifeSpan.years - lifeSpan.birthExpectancy) * 52 + 52) return '#316CFF'
          if (i >= (lifeSpan.years - lifeSpan.adultExpectancy) * 52 && i < (lifeSpan.years - lifeSpan.adultExpectancy) * 52 + 52) return '#32037C'
        } else {
          if (i >= (globalLifeSpan - lifeSpan.birthExpectancy) * 52 && i < (globalLifeSpan - lifeSpan.birthExpectancy) * 52 + 52) return '#316CFF'
          if (i >= (globalLifeSpan - lifeSpan.adultExpectancy) * 52 && i < (globalLifeSpan - lifeSpan.adultExpectancy) * 52 + 52) return '#32037C'
        }
        if (i < (lifeSpan.years - globalLifeSpan) * 52) return '#EABF07'
        if (i >= (globalLifeSpan - lifeSpan.years) * 52) return '#F98AB7'
        else return '#C7C6C5'
      }

      // average
      if (type === 'average-life-span') {
        if (i >= (globalLifeSpan - lifeSpan.birthExpectancy) * 52 && i < (globalLifeSpan - lifeSpan.birthExpectancy) * 52 + 52) return '#316CFF'
        if (i >= (globalLifeSpan - lifeSpan.adultExpectancy) * 52 && i < (globalLifeSpan - lifeSpan.adultExpectancy) * 52 + 52) return '#32037C'
        else return '#C7C6C5'
      }

      // quarterly
      // if (i % 13 === 0) return '#F98AB7'
      // else return '#C7C6C5'

      // bi-yearly
      // if (i % 26 === 0) return '#F98AB7'
      // else return '#C7C6C5'

      // return colourScale(i)
    })

  // merge allows enter and update to be combined, reducing lines of code
  join.merge(enterSel)
    .attr('x', (d, i) => {
      return d.targetX
    })
    .attr('y', (d, i) => {
      if (type === 'diagram') return d.targetY + diagramYTranslate
      if (type === 'single-life-span' || type === 'multiple-life-span' || type === 'average-life-span') return d.targetY
    })
    .attr('width', cellSize)
    .attr('height', cellSize)
    // fillStyle is arbitrary, it could be monkeyButts, we just need an attribute to pass information
    // to canvas so it knows what to draw
    // can't use .style!

  let exitSel = join.exit()
    .attr('width', 0)
    .attr('height', 0)
    .remove()
}

function draw(custom, context, lifeSpan, type) {
  // clears the previous canvas
  context.clearRect(0, 0, width, height)

  // select all the rectangles with data bound to them
  let elements = custom.selectAll('custom.rect')

  elements.each(function (d, i) {
    let node = d3.select(this)

    context.fillStyle = node.attr('fillStyle')
    context.fillRect(node.attr('x'), node.attr('y'), node.attr('width'), node.attr('height'))
  })

  if (type === 'diagram') {
    // life span annotation
    context.fillStyle = 'black'
    // beginPath begins an entirely new path, rather than creating a subpath like moveTo
    context.beginPath()
    context.moveTo(235, 41)
    context.quadraticCurveTo(250, 41, 250, 98)
    context.lineTo(250, height - 50)
    context.quadraticCurveTo(250, height, 235, height - 2)
    context.lineWidth = 1.25
    context.stroke()
    // text
    context.font = 'bold 9px Allerta Stencil'
    context.fillText(`${globalLifeSpan} years`, 260, 200)

    // year annotation
    context.beginPath()
    context.moveTo(1, 38)
    context.quadraticCurveTo(0, 25, 25, 25)
    context.lineTo(210, 25)
    context.quadraticCurveTo(230, 25, 232, 38)
    context.lineWidth = 1.25
    context.stroke()
    // text
    context.font = 'bold 9px Allerta Stencil'
    context.fillText('1 year', 100, 15)

    // week annotation
    context.beginPath()
    context.moveTo(116, 83)
    context.quadraticCurveTo(99.5, 70, 80, 85)
    // context.lineTo(85, 96.5)
    context.lineWidth = 1.25
    context.stroke()
    // text
    context.font = 'bold 9px Allerta Stencil'
    context.fillText('1 week', 46, 95)
  }

  if (type === 'multiple-life-span') {
    // life span
    context.fillStyle = 'black'
    context.font = 'bold 50px Allerta Stencil'
    context.fillText(lifeSpan.years, 85, 175)
  }
}

// multiple
// height = 300
// cellSize = 1
// cellSpacing = 1
// update(createDataMultiple(globalLifeSpan, 5), '#seventeeth-century', [
//   { name: 'Pocahontas', years: 20 },
//   { name: 'Sir Isaac Newton', years: 84 },
//   { name: 'Anne, Queen of Great Britain', years: 49 },
//   { name: 'Elizabeth Báthory', years: 54 },
//   { name: 'Rembrandt', years: 63 }
// ], 'life-span')

// week year vis
// let weekYearVisHeight = 35,
//   weekYearVisCellSize = 4.5,
//   weekYearVisCellSpacing = 1,
//   weekYearVis = d3.select('#week-year-vis').append('svg').attr('viewBox', `0 0 300 ${weekYearVisHeight}`)

// for (i = 0; i < 52; i++) {
//   weekYearVis.append('rect')
//     .attr('x', () => i * (weekYearVisCellSize + weekYearVisCellSpacing))
//     .attr('y', weekYearVisHeight / 2)
//     .attr('width', weekYearVisCellSize)
//     .attr('height', weekYearVisCellSize)
//     .attr('fill', () => {
//       if (i < 1) return '#000'
//       if (i >= 1 && i < 52) return '#F98AB7'
//       else return '#C7C6C5'
//     })
// }
//
// d3.select('#move').on('click', function (d) {
//   data.forEach((datum, index) => {
//     let x0 = Math.floor(index / 100) % 10, x1 = Math.floor(index % 10)
//     let y0 = Math.floor(index / 1000), y1 = Math.floor(index % 100 / 10)

//     datum.sourceX = datum.x
//     datum.sourceY = datum.y
//     datum.targetX = groupSpacing * x0 + (cellSpacing + cellSize) * (x1 + x0 * 20)
//     datum.targetY = groupSpacing * y0 + (cellSpacing + cellSize) * (y1 + y0 * 20)
//     datum.x = groupSpacing * x0 + (cellSpacing + cellSize) * (x1 + x0 * 20)
//     datum.y = groupSpacing * y0 + (cellSpacing + cellSize) * (y1 + y0 * 20)
//   })

//   update(data)
// })

// d3.select('#original').on('click', function (d) {
//   data.forEach((datum, index) => {
//     let x0 = Math.floor(index / 100) % 10, x1 = Math.floor(index % 10)
//     let y0 = Math.floor(index / 1000), y1 = Math.floor(index % 100 / 10)

//     datum.sourceX = datum.x
//     datum.sourceY = datum.y
//     datum.targetX = groupSpacing * x0 + (cellSpacing + cellSize) * (x1 + x0 * 10)
//     datum.targetY = groupSpacing * y0 + (cellSpacing + cellSize) * (y1 + y0 * 10)
//     datum.x = groupSpacing * x0 + (cellSpacing + cellSize) * (x1 + x0 * 10)
//     datum.y = groupSpacing * y0 + (cellSpacing + cellSize) * (y1 + y0 * 10)
//   })

//   update(data)
// })
