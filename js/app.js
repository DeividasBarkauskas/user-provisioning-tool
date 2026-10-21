(()=>{
  const $ = s => document.querySelector(s);

  const fields = {
    name:'#name', surname:'#surname', email:'#email',
    employeeNumber:'#employeeNumber', employeeId:'#employeeId',
    workplace:'#workplace', login:'#login', extras:'#extraWorkplaces'
  };

  const rx = {
    email:/Email\s*:\s*([^\s]+)/i,
    name:/Name\s*:\s*([^\n\r]+)/i,
    employeeNumber:/Employee\s*Number\s*:\s*([A-Za-z0-9-]+)/i,
    employeeId:/Employee\s*ID\s*:\s*([A-Za-z0-9-]+)/i,
    login:/Login\s*:\s*([A-Za-z0-9._-]+)/i,
    workplace:/Main\s*Workplace\s*:\s*([0-9]{1,2}\.[0-9]{1,3}[a-z]?)/i,
    extras:/Additional\s*Workplaces\s*:\s*(.+)$/im,
    workplaceToken:/(\d+(?:\.\d+)?[a-z]?)/gi
  };

  function splitName(value) {
    const parts = (value || '').trim().replace(/\s+/g, ' ').split(' ');
    return { name: parts[0] || '', surname: parts.slice(1).join(' ') || '' };
  }

  function parse(text) {
    const out = {name:'', surname:'', email:'', employeeNumber:'', employeeId:'', workplace:'', login:'', extras:[]};
    let match;

    if ((match = text.match(rx.name))) {
      const parsedName = splitName(match[1]);
      out.name = parsedName.name;
      out.surname = parsedName.surname;
    }
    if ((match = text.match(rx.email))) out.email = match[1];
    if ((match = text.match(rx.employeeNumber))) out.employeeNumber = match[1];
    if ((match = text.match(rx.employeeId))) out.employeeId = match[1];
    if ((match = text.match(rx.login))) out.login = match[1];
    if ((match = text.match(rx.workplace))) out.workplace = match[1];

    if ((match = text.match(rx.extras))) {
      rx.workplaceToken.lastIndex = 0;
      let token;
      while ((token = rx.workplaceToken.exec(match[1])) !== null) out.extras.push(token[1]);
    }
    return out;
  }

  function paint(o) {
    $(fields.name).value = o.name;
    $(fields.surname).value = o.surname;
    $(fields.email).value = o.email;
    $(fields.employeeNumber).value = o.employeeNumber;
    $(fields.employeeId).value = o.employeeId;
    $(fields.workplace).value = o.workplace;
    $(fields.login).value = o.login;
    $(fields.extras).value = [...new Set(o.extras.filter(x => x !== o.workplace))].join(', ');
  }

  function values() {
    rx.workplaceToken.lastIndex = 0;
    const extras = [];
    let token;
    while ((token = rx.workplaceToken.exec($(fields.extras).value)) !== null) extras.push(token[1]);

    const workplace = $(fields.workplace).value.trim();
    return {
      name:$(fields.name).value.trim(),
      surname:$(fields.surname).value.trim(),
      email:$(fields.email).value.trim(),
      employeeNumber:$(fields.employeeNumber).value.trim(),
      employeeId:$(fields.employeeId).value.trim(),
      workplace,
      login:$(fields.login).value.trim(),
      extras:[...new Set(extras.filter(x => x !== workplace))]
    };
  }

  const esc = s => String(s || '').replace(/'/g, "''");

  function buildSQL(o) {
    const extra = o.extras.join(', ');
    return `-- PORTFOLIO DEMO: generalized schema and synthetic workflow
START TRANSACTION;

SET @first_name = '${esc(o.name)}';
SET @last_name = '${esc(o.surname)}';
SET @email = '${esc(o.email)}';
SET @employee_number = '${esc(o.employeeNumber)}';
SET @employee_identifier = '${esc(o.employeeId)}';
SET @login = '${esc(o.login.toUpperCase())}';
SET @main_workplace = '${esc(o.workplace)}';
SET @additional_workplaces = '${esc(extra)}';

-- Authentication credentials are handled by the target system
-- and are intentionally outside the scope of this public demo.

INSERT INTO demo_employees
(first_name, last_name, email, employee_number, employee_identifier, login)
SELECT @first_name, @last_name, @email, @employee_number, @employee_identifier, @login
WHERE NOT EXISTS (SELECT 1 FROM demo_employees WHERE login = @login);

-- Workplace assignment is represented with generalized demo tables.
INSERT INTO demo_employee_workplaces (login, workplace_code, is_default)
SELECT @login, @main_workplace, 1
WHERE @main_workplace <> '';

-- Additional workplace values parsed by the browser tool:
-- ${esc(extra || 'none')}

COMMIT;`;
  }

  function update() {
    const o = values();
    const missing = [];
    if (!o.employeeNumber) missing.push('employee number');
    if (!o.employeeId) missing.push('employee ID');
    if (!o.workplace) missing.push('workplace');
    if (!o.login) missing.push('login');

    $('#state').textContent = missing.length ? 'Missing: ' + missing.join(', ') : 'Required fields OK';
    $('#state').className = missing.length ? 'err' : 'ok';
    $('#sql').textContent = buildSQL(o);
  }

  function reparse() {
    paint(parse($('#src').value));
    update();
  }

  $('#src').addEventListener('input', reparse);
  Object.values(fields).forEach(selector => $(selector).addEventListener('input', update));
  $('#uppercase').addEventListener('click', () => {
    $(fields.login).value = $(fields.login).value.toUpperCase();
    update();
  });
  $('#toggle').addEventListener('click', () => {
    $('#sql').style.display = $('#sql').style.display === 'block' ? 'none' : 'block';
  });
  $('#copy').addEventListener('click', async () => {
    const text = $('#sql').textContent.trim();
    if (text) await navigator.clipboard.writeText(text);
  });

  update();
})();
