var isMktoForm = window.setInterval(function () {
    if (typeof(MktoForms2) === 'object'
      && typeof(MktoForms2.whenReady) === 'function') {
      console.log('Getting: Form');

      window.clearInterval(isMktoForm);

      MktoForms2.whenReady(function (form) {
        let firstName = getCookie('onelogin_first_name'),
        lastName = getCookie('onelogin_last_name'),
        email = getCookie('onelogin_email');

        function getUrlParam(param) {
          console.log('Getting: URL Parameter: ' + param);

          let paramString = window.location.href.split('?')[1];

          if (paramString) {
            let params = paramString.split('&'),
            paramPair,
            paramName,
            paramValue;

            for (let i = 0; i < params.length; i++) {
              paramPair = params[i].split('=');
              paramName = paramPair[0];
              paramValue = paramPair[1];

              if (paramName == param) {
                console.log('URL Parameter: ' + paramName + ' = ' + paramValue);
                return paramValue;
              }
            }
          }
          return false;
        }

        function getCookie(cookieName) {
          console.log('Getting: Cookie ' + cookieName);

          let name = cookieName + '=',
          cookies = document.cookie.split(';'),
          currCookie;

          for (let i = 0; i < cookies.length; i++) {
            currCookie = cookies[i].trim();
            if (currCookie.indexOf(name) == 0) {
              return currCookie.substring(name.length, currCookie.length);
            }
          }
          console.log('Getting: Cookie ' + cookieName + ' not found');
          return null;
        }

        function capitalizeName(name) {
          let Name = '',
          nameSplit = name.trim().split(' ');

          for (let i = 0; i < nameSplit.length; i++) {
            let part = nameSplit[i];

            if (i != 0) {
              Name += ' ';
            }
            Name += part.charAt(0).toUpperCase() + part.substring(1);
          }

          return Name;
        }

        form.onValidate(function () {
          let email = form.getValues().Email.toLowerCase().trim(),
          localPart = email.split('@')[0],
          domain = email.split('@')[1],
          role = form.getValues().userRole,
          company = form.getValues().Company;

          if (email.search(/["\(\),:;<>\[\]\\ ]/) != -1) {
            form.showErrorMessage('Must be a valid email.<br>example@yourdomain.com', form.getFormElem().find('#Email'));
            form.submittable(false);
            return false;
          } else if (localPart.search(/(^\.|\.$|\.\.)/) != -1) {
            form.submittable(false);
            form.showErrorMessage('Must be a valid email.<br>example@yourdomain.com', form.getFormElem().find('#Email'));
            return false;
          }

          if (domain == 'marketo.com'
             && role == 'Partner') {
            form.submittable(false);
            form.showErrorMessage('Do not select <i>Partner</i> for your role if your email is <u>@marketo.com</u>', form.getFormElem().find('#userRole'));
            return false;
          }

          if (domain != 'marketo.com'
             && role != 'Partner') {
            form.submittable(false);
            form.showErrorMessage('Select <i>Partner</i> for your role if your email is not <u>@marketo.com</u>', form.getFormElem().find('#userRole'));
            return false;
          }

          form.vals({
            FirstName: capitalizeName(form.getValues().FirstName),
            LastName: capitalizeName(form.getValues().LastName),
            Email: form.getValues().Email.toLowerCase().trim(),
            Company: capitalizeName(form.getValues().Company),
            domain: domain
          });

          if (domain == 'marketo.com') {
            let instance = getUrlParam('instance');
            
            if (instance) {
              let ownWorkspace = JSON.parse(getUrlParam('ownWorkspace'));
              
              switch (parseInt(instance)) {
              case 1:
                form.vals({
                  userId106: localPart + '.demo@marketo.com',
                  Company: 'Marketo',
                  hasUserWorkspace: ownWorkspace
                });
                break;
              
              case 2:
                form.vals({
                  userIdMaster: localPart + '@marketolive.com',
                  Company: 'Marketo',
                  hasUserWorkspace: ownWorkspace
                });
                break;
              
              case 3:
                form.vals({
                  userId106: localPart + '.demo@marketo.com',
                  userIdMaster: localPart + '@marketolive.com',
                  Company: 'Marketo',
                  hasUserWorkspace: ownWorkspace
                });
                break;
              }
            } else if (role == 'SC'
               || role == 'SA'
               || role == 'RFP'
               || role == 'DS') {
              form.vals({
                //userId106: localPart + '.demo@marketo.com',
                userIdMaster: localPart + '@marketolive.com',
                Company: 'Marketo',
                hasUserWorkspace: true
              });
            } else if (role == 'PM'
               || role == 'PMM'
               || role == 'Partner Ops'
               || role == 'VC'
               || role == 'Exec') {
              form.vals({
                userIdMaster: localPart + '@marketolive.com',
                Company: 'Marketo',
                hasUserWorkspace: true
              });
            } else {
              form.vals({
                //userId106: localPart + '@marketolive.com',
                userIdMaster: localPart + '@marketolive.com',
                Company: 'Marketo',
                hasUserWorkspace: false
              });
            }
          } else if (form.getValues().userRole == 'Partner') {
            let ownWorkspace = JSON.parse(getUrlParam('ownWorkspace'));

            if (localPart.search(/\./) != -1) {
              let firstLetter = localPart.charAt(0),
              lastName = localPart.substring(localPart.lastIndexOf('.') + 1);

              form.vals({
                userIdMaster: firstLetter + lastName + '.' + domain.split('.')[0] + '@marketolive.com',
                hasUserWorkspace: ownWorkspace
              });
            } else {
              form.vals({
                userIdMaster: localPart + '.' + domain.split('.')[0] + '@marketolive.com',
                hasUserWorkspace: ownWorkspace
              });
            }
          }

          form.submittable(true);
          //alert(JSON.stringify(form.vals(), null, 2));
        });

        form.onSuccess(function (values, followUpUrl) {
          let title = document.getElementById('modalTitle'),
          message = document.getElementById('theForm');

          form.getFormElem().hide();
          message.innerHTML = "<br><div align='center'>You will receive your login account in 24 - 48 hours.</div>";
          if (title) {
            title.innerHTML = 'Account Requested';
          }
          return false;
        });

        if (firstName != null) {
          form.vals({
            FirstName: firstName
          });
        }

        if (lastName != null) {
          form.vals({
            LastName: lastName
          });
        }

        if (email != null) {
          form.vals({
            Email: email
          });
        }

        if (form.getFormElem().find('#Email').length > 0) {
          form.getFormElem().find('#Email')[0].onblur = function () {
            if (this.value
               && this.value.split('@').length > 0) {
              if (this.value.split('@')[1].toLowerCase().trim() == 'marketo.com') {
                form.getFormElem().find('#Company')[0].value = 'Marketo';
              } else {
                form.getFormElem().find('#userRole')[0].value = 'Partner';
              }
            }
          };
        }
      });
    }
  }, 0);