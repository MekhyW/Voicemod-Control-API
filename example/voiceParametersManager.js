const voicesParametersArticle = $('#voicesParametersArticle');
const voicesParametersArticleSelect = voicesParametersArticle.find('#setCurrentVoiceParameter-parameterName');

const voiceParametersManager = {
	currentVoiceId: '',
	currentVoiceParameters: {},
};

voiceParametersManager.onVoiceChange = (currentVoice) => {
	if (!currentVoice) {
		return;
	}

	voiceParametersManager.currentVoiceId = currentVoice.voiceId;
	voiceParametersManager.currentVoiceParameters = currentVoice.parameters;

	voicesParametersArticleSelect.html('');

	let firstParameter = true;
	for (const param in currentVoice.parameters) {

		if (firstParameter) {
			setParameterValues(currentVoice.parameters[param]);
			firstParameter = false;
		}

		voicesParametersArticleSelect.append(`<option val="${param}">${param}</option>`);
	}
};

voiceParametersManager.onParameterChange = (parameterChangePayload) => {
	const changedParameterName = toCamelCase(parameterChangePayload.parameter.name);
	const parameter = voiceParametersManager.currentVoiceParameters[changedParameterName];
	if (!parameter) {
		return;
	}

	parameter.value = parameterChangePayload.parameter.value;

	if (changedParameterName === voicesParametersArticleSelect.val()) {
		setParameterValues(parameter);
	}
}

voicesParametersArticleSelect.change(() => {
	const parameter = voiceParametersManager.currentVoiceParameters[voicesParametersArticleSelect.val()];
	if(!parameter) {
		return;
	}


	setParameterValues(parameter);
});

const setParameterValues = (parameter) => {
	if(!parameter) {
		return;
	}

	$('#setCurrentVoiceParameter-maxValue').val(parameter.maxValue);
	$('#setCurrentVoiceParameter-minValue').val(parameter.minValue);
	$('#setCurrentVoiceParameter-value').val(parameter.value);
	$('#setCurrentVoiceParameter-displayNormalized').attr("checked", parameter.displayNormalized);
}

jQuery('#setCurrentVoiceParameters').click(() => {
   const request = {
       parameterName: $('#setCurrentVoiceParameter-parameterName').val(),
       parameterValue: {
           maxValue: parseFloat($('#setCurrentVoiceParameter-maxValue').val()),
           minValue: parseFloat($('#setCurrentVoiceParameter-minValue').val()),
           displayNormalized: $('#setCurrentVoiceParameter-displayNormalized').is(':checked'),
           value: parseFloat($('#setCurrentVoiceParameter-value').val()),
       },
   };
   console.log('sending', request);
   Voicemod.sendMessageToServer("setCurrentVoiceParameter", request);
});

const toCamelCase = (input) => {
	if (!input || typeof input !== 'string')
		return;

	return `${input[0].toLowerCase()}${input.substr(1)}`;
}