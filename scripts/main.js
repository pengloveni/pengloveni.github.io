;(function (window) {
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame

  const FRAME_RATE = 60
  const PARTICLE_NUM = 2000
  const RADIUS = Math.PI * 2
  const CANVASWIDTH = 700
  const CANVASHEIGHT = 150
  const CANVASID = 'canvas'

  let texts = ['MY DEAR Ni', 'THIS YEAR,', 'WE MAY BE', 'PHYSICALLY LONELY.', 'BUT OUR HEARTS', 'NEVER GO', 'SO CLOSELY.', 'WE LIVE TOGETHER', 'LIKE A FAMILY,', 'CREATE ALL', 'GOOD MEMORY,', 'LIKE ALL', 'BRIGHT STARS,', 'SILENTLY SHINY.', 'OUR HEARTS,', 'FULFILLED WITH JOY,', 'THOUGH LIFE,', 'NOT EASY.', 'WE NEVER KNOW,', 'OUR DESTINY.', 'BUT LOVE IS', 'THE ONLY CERTAINTY.', 'MAY OUR LOVE,', 'WITNESS', 'OUR GROWTH,', 'UNTIL', 'FORMING A FAMILY.', 'LOVE YOU, Peng']

  // 2019-08-06-13:00
  const theDay = new Date("8/6/2019 13:00:00");

  let canvas,
    ctx,
    particles = [],
    quiver = true,
    text = texts[0],
    textIndex = 0,
    textSize = 70

  function draw () {
    ctx.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT)
    ctx.fillStyle = 'rgb(255, 255, 255)'
    ctx.textBaseline = 'middle'
    ctx.fontWeight = 'bold'
    ctx.font = textSize + 'px \'SimHei\', \'Avenir\', \'Helvetica Neue\', \'Arial\', \'sans-serif\''
    ctx.fillText(text, (CANVASWIDTH - ctx.measureText(text).width) * 0.5, CANVASHEIGHT * 0.5)

    let imgData = ctx.getImageData(0, 0, CANVASWIDTH, CANVASHEIGHT)

    ctx.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT)

    for (let i = 0, l = particles.length; i < l; i++) {
      let p = particles[i]
      p.inText = false
    }
    particleText(imgData)

    window.requestAnimationFrame(draw)
  }

  function particleText (imgData) {
    var pxls = []
    for (var w = CANVASWIDTH; w > 0; w -= 3) {
      for (var h = 0; h < CANVASHEIGHT; h += 3) {
        var index = (w + h * (CANVASWIDTH)) * 4
        if (imgData.data[index] > 1) {
          pxls.push([w, h])
        }
      }
    }

    var count = pxls.length
    var j = parseInt((particles.length - pxls.length) / 2, 10)
    j = j < 0 ? 0 : j

    for (var i = 0; i < pxls.length && j < particles.length; i++, j++) {
      try {
        var p = particles[j],
          X,
          Y

        if (quiver) {
          X = (pxls[i - 1][0]) - (p.px + Math.random() * 10)
          Y = (pxls[i - 1][1]) - (p.py + Math.random() * 10)
        } else {
          X = (pxls[i - 1][0]) - p.px
          Y = (pxls[i - 1][1]) - p.py
        }
        var T = Math.sqrt(X * X + Y * Y)
        var A = Math.atan2(Y, X)
        var C = Math.cos(A)
        var S = Math.sin(A)
        p.x = p.px + C * T * p.delta
        p.y = p.py + S * T * p.delta
        p.px = p.x
        p.py = p.y
        p.inText = true
        p.fadeIn()
        p.draw(ctx)
      } catch (e) {}
    }
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i]
      if (!p.inText) {
        p.fadeOut()

        var X = p.mx - p.px
        var Y = p.my - p.py
        var T = Math.sqrt(X * X + Y * Y)
        var A = Math.atan2(Y, X)
        var C = Math.cos(A)
        var S = Math.sin(A)

        p.x = p.px + C * T * p.delta / 2
        p.y = p.py + S * T * p.delta / 2
        p.px = p.x
        p.py = p.y

        p.draw(ctx)
      }
    }
  }

  function setDimensions () {
    canvas.width = CANVASWIDTH
    canvas.height = CANVASHEIGHT
    canvas.style.position = 'absolute'
    canvas.style.left = '0%'
    canvas.style.top = '0%'
    canvas.style.bottom = '0%'
    canvas.style.right = '0%'
    canvas.style.marginTop = window.innerHeight * .15 + 'px'
  }

  function event () {
    document.addEventListener('click', function (e) {
      textIndex++
      if (textIndex >= texts.length) {
        textIndex--
        return
      }
      text = texts[textIndex]
      // console.log(textIndex)
    }, false)

    document.addEventListener('touchstart', function (e) {
      textIndex++
      if (textIndex >= texts.length) {
        textIndex--
        return
      }
      text = texts[textIndex]
      // console.log(textIndex)
    }, false)
  }

  function timeElapse(date){
    var current = Date();
    var seconds = (Date.parse(current) - Date.parse(date)) / 1000;
    var days = Math.floor(seconds / (3600 * 24));
    seconds = seconds % (3600 * 24);
    var hours = Math.floor(seconds / 3600);
    if (hours < 10) {
      hours = "0" + hours;
    }
    seconds = seconds % 3600;
    var minutes = Math.floor(seconds / 60);
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    seconds = seconds % 60;
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    var result = days + " D " + hours + " H " + minutes + " M " + seconds + " S";
    return result;
  }

  async function show_date_time() {
    while (true) {
      await new Promise(r => setTimeout(r, 1000));
      if (textIndex + 1 >= texts.length) {
        text = timeElapse(theDay);
      }
    }
  }


  function init () {
    canvas = document.getElementById(CANVASID)
    if (canvas === null || !canvas.getContext) {
      return
    }
    ctx = canvas.getContext('2d')
    setDimensions()

    let together = timeElapse(theDay);
    texts.push(together);

    event()

    show_date_time()

    for (var i = 0; i < PARTICLE_NUM; i++) {
      particles[i] = new Particle(canvas)
    }

    draw()
  }

  class Particle {
    constructor (canvas) {
      let spread = canvas.height
      let size = Math.random() * 1.2
      this.delta = 0.06
      this.x = 0
      this.y = 0
      this.px = Math.random() * canvas.width
      this.py = (canvas.height * 0.5) + ((Math.random() - 0.5) * spread)
      this.mx = this.px
      this.my = this.py
      this.size = size
      // this.origSize = size
      this.inText = false
      this.opacity = 0
      this.fadeInRate = 0.005
      this.fadeOutRate = 0.03
      this.opacityTresh = 0.98
      this.fadingOut = true
      this.fadingIn = true
    }
    fadeIn () {
      this.fadingIn = this.opacity > this.opacityTresh ? false : true
      if (this.fadingIn) {
        this.opacity += this.fadeInRate
      }else {
        this.opacity = 1
      }
    }
    fadeOut () {
      this.fadingOut = this.opacity < 0 ? false : true
      if (this.fadingOut) {
        this.opacity -= this.fadeOutRate
        if (this.opacity < 0) {
          this.opacity = 0
        }
      }else {
        this.opacity = 0
      }
    }
    draw (ctx) {
      ctx.fillStyle = 'rgba(226,225,142, ' + this.opacity + ')'
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, RADIUS, true)
      ctx.closePath()
      ctx.fill()
    }
  }
  
  // var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  //   if(!isChrome){
  //     $('#iframeAudio').remove()
  // }
  
  // setTimeout(() => {
    init()  
  // }, 4000);
  // mp3.play()
})(window)
