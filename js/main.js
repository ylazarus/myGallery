'use strict'

function onInit() {
    renderProjects()
    renderModals()
}


function renderProjects() {
    var projects = getProjects()
    var strHtmls = []
    for (let i = 0; i < projects.length; i++) {
        var strHtml = `
    <div class="col-md-4 col-sm-6 portfolio-item">
    <a class="portfolio-link" data-toggle="modal" href="#portfolioModal${i + 1}">
      <div class="portfolio-hover">
        <div class="portfolio-hover-content">
          <i class="fa fa-plus fa-3x"></i>
        </div>
      </div>
      <img class="img-fluid" src="img/project-photos/${projects[i].name}.jpg" alt="">
    </a>
    <div class="portfolio-caption">
      <h4>${projects[i].name}</h4>
      <p class="text-muted">${projects[i].title}</p>
    </div>
  </div>
    `
        strHtmls.push(strHtml)
    }
    $('.projects').html(strHtmls)
}


function renderModals() {
    var projects = getProjects()
    var strHtmls = []
    for (let i = 0; i < projects.length; i++) {
        var strHtml = `
    <div class="portfolio-modal modal fade" id="portfolioModal${i + 1}" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="close-modal" data-dismiss="modal">
          <div class="lr">
            <div class="rl"></div>
          </div>
        </div>
        <div class="container">
          <div class="row">
            <div class="col-lg-8 mx-auto">
              <div class="modal-body">
                <!-- Project Details Go Here -->
                <h2>${projects[i].name}</h2>
                <p class="item-intro text-muted">${projects[i].title}</p>
                <img class="img-fluid d-block mx-auto" src="img/project-photos/${projects[i].name}.jpg" alt="">
                <p>${projects[i].desc}</p>
                <ul class="list-inline">
                  <li>Date: ${projects[i].publishedAt}</li>
                  <li>url: ${projects[i].url}</li>
                  <a href="${projects[i].url}" target="_blank" class="btn btn-primary "
                         tabindex="-1" role="button" aria-disabled="true">Check it out!</a>

                  <li>Labels: ${projects[i].labels.join(' ')}</li>
                </ul>
                <button class="btn btn-primary" data-dismiss="modal" type="button">
                    <i class="fa fa-times"></i>
                    Close Project</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    `
        strHtmls.push(strHtml)
    }
    $('.modal-container').html(strHtmls)
}

function onSendEmail(){
    var elAddress = document.querySelector('input[name=email-address]')
    var address = elAddress.value
    var elSubject = document.querySelector('input[name=subject]')
    var subject = elSubject.value
    var elMessage = document.querySelector('input[name=email-body]')
    var message = elMessage.value

    var url = `https://mail.google.com/mail/u/0/?fs=1&to=ylazarus@gmail.com&su=${subject}_from_${address}&body=${message}&tf=cm`
    window.open(url)

}





