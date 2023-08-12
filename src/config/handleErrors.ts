import { alertError } from '../config/alert';

function buildArrayError(error: any) {
  let html = '';

  if (error.data.errors) {
    Object.values(error.data.errors).forEach((item) => {
      html += `<p>${item}</p>`;
    });

    return html;
  }

  return error.data.message;
}

export default function (error: any) {
  let title = 'Opss!';
  let text = '';

  switch (error.status) {
    case 404:
      text = 'A rota informada não foi encontrada ou não existe';
      break;

    case 405:
      title = 'Erro interno';
      text = 'Método informado não permitido';
      break;

    case 419:
      text = 'Sua sessão expirou. Faça login novamente para continuar';
      break;

    case 422:
      title = 'Atenção';
      text = buildArrayError(error);
      break;

    case 409:
      title = 'Atenção!';
      text = error.data.message;
      break;

    default:
      title = 'Erro inesperado';
      text = 'Houve um erro inesperado no sistema. Tente novamente mais tarde!';
      break;
  }

  alertError({
    title,
    text,
  });
}
