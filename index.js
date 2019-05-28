// TAKEAWAYS
// to create viz with canvas, two steps are required: 1) bind the data 2) draw the viz

// set up variables
let width = 350,
  height = 385

let averageUSLifeSpan = 80

let groupSpacing = 4,
  cellSpacing = 1.5,
  offsetTop = height / 5,
  cellSize = 3

let diagramYTranslate = 40

// initial call to functions to bind data and draw rectangle elements
update(createData(averageUSLifeSpan), '#diagram', { name: '', years: 0 }, 'diagram')

// // pocahontas
update(createData(averageUSLifeSpan), '#pocahontas', { name: 'Pocahontas', years: 20 }, 'single-life-span')

// // sir isaac newton
update(createData(84), '#sir-isaac-newton', { name: 'Sir Isaac Newton', years: 84 }, 'single-life-span')

// 1600's
update(createData(averageUSLifeSpan), '#sixteen-hundreds-pocahontas', { name: 'Pocahontas', years: 20 }, 'multiple-life-span')
update(createData(84), '#sixteen-hundreds-newton', { name: 'Sir Isaac Newton', years: 84 }, 'multiple-life-span')
update(createData(83), '#sixteen-hundreds-voltaire', { name: 'Voltaire', years: 83 }, 'multiple-life-span')
update(createData(averageUSLifeSpan), '#sixteen-hundreds-rembrandt', { name: 'Rembrandt', years: 63 }, 'multiple-life-span')
update(createData(averageUSLifeSpan), '#sixteen-hundreds-galilei', { name: 'Galileo Galilei', years: 77 }, 'multiple-life-span')
update(createData(averageUSLifeSpan), '#sixteen-hundreds-bathory', { name: 'Elizabeth Bathory', years: 54 }, 'multiple-life-span')
update(createData(averageUSLifeSpan), '#sixteen-hundreds-anne', { name: 'Anne, Queen of Great Britain', years: 49 }, 'multiple-life-span')

function createData(years) {
  let data = []

  // create the initial set of data points
  // 4160 = 80 * 52 (the average US lifespan in weeks)
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
    let x0 = ((cellSize + cellSpacing) * index) - (52 * y0) + (Math.floor(index / (averageUSLifeSpan * 52)) * lifeSpanSpacing)

    data.push({
      value: el,
      x: x0,
      y: y0,
      sourceX: x0,
      sourceY: y0 - (Math.floor(index / (averageUSLifeSpan * 52)) * 160),
      targetX: x0,
      targetY: y0 - (Math.floor(index / (averageUSLifeSpan * 52)) * 160)
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
      if (type === 'single-life-span' || type === 'multiple-life-span') return d.sourceY
    })
    .attr('width', 0)
    .attr('height', 0)
    .attr('fillStyle', (d, i) => {
      // original
      if (type === 'diagram') {
        if (i === 546) return '#0049FF'
        if (i >= 0 && i < 52 ) return '#EF06BD'
        else return '#c7c6c5'
      }

      // life spans
      if (type === 'single-life-span' || type === 'multiple-life-span') {
        if (lifeSpan.length) {
          if (i >= (0 * averageUSLifeSpan * 52) && i < ((0 * averageUSLifeSpan * 52) + (lifeSpan[0].years * 52))) return '#EF06BD'
          if (i >= (1 * averageUSLifeSpan * 52) && i < ((1 * averageUSLifeSpan * 52) + (lifeSpan[1].years * 52))) return '#EF06BD'
          if (i >= (2 * averageUSLifeSpan * 52) && i < ((2 * averageUSLifeSpan * 52) + (lifeSpan[2].years * 52))) return '#EF06BD'
          if (i >= (3 * averageUSLifeSpan * 52) && i < ((3 * averageUSLifeSpan * 52) + (lifeSpan[3].years * 52))) return '#EF06BD'
          if (i >= (4 * averageUSLifeSpan * 52) && i < ((4 * averageUSLifeSpan * 52) + (lifeSpan[4].years * 52))) return '#EF06BD'
          else return '#c7c6c5'
        } else {
          if (i < lifeSpan.years * 52 && i < averageUSLifeSpan * 52) return '#EF06BD'
          if (i < lifeSpan.years * 52 && i >= averageUSLifeSpan * 52) return 'blue'
          else return '#c7c6c5'
        }
      }

      // quarterly
      // if (i % 13 === 0) return '#EF06BD'
      // else return '#c7c6c5'

      // bi-yearly
      // if (i % 26 === 0) return '#EF06BD'
      // else return '#c7c6c5'

      // return colourScale(i)
    })

  // merge allows enter and update to be combined, reducing lines of code
  join.merge(enterSel)
    .attr('x', (d, i) => {
      return d.sourceX
    })
    .attr('y', (d, i) => {
      if (type === 'diagram') return d.sourceY + diagramYTranslate
      if (type === 'single-life-span' || type === 'multiple-life-span') return d.sourceY
    })
    .transition()
    .duration(1000)
    .attr('x', (d, i) => {
      return d.targetX
    })
    .attr('y', (d, i) => {
      if (type === 'diagram') return d.targetY + diagramYTranslate
      if (type === 'single-life-span' || type === 'multiple-life-span') return d.targetY
    })
    .attr('width', cellSize)
    .attr('height', cellSize)
    // fillStyle is arbitrary, it could be monkeyButts, we just need an attribute to pass information
    // to canvas so it knows what to draw
    // can't use .style!

  let exitSel = join.exit()
    .transition()
    .duration(100)
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
    context.lineTo(250, 350)
    context.quadraticCurveTo(250, 400, 235, 398)
    context.lineWidth = 1.25
    context.stroke()
    // text
    context.font = 'bold 9px Allerta Stencil'
    context.fillText('80 years', 260, 200)

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
// update(createDataMultiple(averageUSLifeSpan, 5), '#sixteen-hundreds', [
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
//       if (i < 1) return '#0049FF'
//       if (i >= 1 && i < 52) return '#EF06BD'
//       else return '#c7c6c5'
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
