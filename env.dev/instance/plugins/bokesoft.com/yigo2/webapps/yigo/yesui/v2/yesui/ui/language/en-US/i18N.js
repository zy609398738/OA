var other = {
	control : {
		require : "-Must full in-"
	},

	attachment : {
		name : "Attachment name",
		time : "Upload time",
		people : "Upload people",
		url : "Attachment path",
		exercise : "exercise",
		ldo : "do",
		operation : "Operation",
		upload : "upload",
		download : "download",
		ldelete : "delete",
		preview : "preview",
		noContent : "No content in the table",
		unable : "Newly add state cannot upload operation!"
	},

	listview : {
		order : "order",
		number : "Serial number"
	},

	dict : {
		unknown : 'Unknown type:',
		query : "query",
		cancel : "cancel",
		determine : "determine",
		empty : "empty",
		code : "code",
		name : "name"
	},
	
	date : {
		today : "today",
		confirm : "confirm",
		formatError : "The format of the input is wrong",
		wrongTime:"Wrong time:"
	},

	yescombobox : {
		nothing : "nothing"
	},

	grid : {
		whetherEmpty : "Whether to empty all of the child data?",
		nonsupport : "Table sorting does not support grouping!",
		lundefined : "The extension source is undefined",
		total : "A toltal of {0} bars",
		noData : "No data display",
		recordtext : "A toltal of {2} bars",
		jumpTo : "Jump to: {0}page",
		deleteRecord : "Delete the selected record?",
		addRecord : "Adding a new record",
		delRecord : "Delete the selected record",
		moveUp : "Move up data rows",
		moveDown : "Move down rows of data",
		isNotTable : "The table initialization error,initialization the HtmlElement is not the Table type",
		isErrorMode : "The rendering mode(documentMode) of the page where the form is located is less than 5",
		model : "colNames and colModel vary in length!",
		isSortError : "Sorting is not allowed in line groupings",
		notAllow : "Multiple choice compound dictionary {0} does not allow data binding fields",
		prompt : "prompt",
		open : "open",
		see : "To view",
		eliminate : "eliminate"
	},

	userinfopane : {
		admin : "System administrator",
		logout : "cancellation",
		quit : "quit"
	},


	rightsset : {
		setUp : "Dictionary permissions settings",
		modify : "modify",
		save : "save",
		select : "Select all",
		sign : "sign",
		coding : "coding",
		jurisdiction : "Whether have permissions",
		search : "search",
		formSet : "Form permission settings",
		inletSet : "Entry permission settings"
	},

	

	baidumap : {
		inputPlace : "Please enter the search site...",
		eventTest : "Event test",
		address : "Address:XX city,XX district XXXXXXX",
		canton : "Administrative region",
		inputName : "Please enter the name of the administrative region...",
		failTo : "Failed to obtain current input admin area",
		currentDot : "Current point"
	},

	calendar : {
		months : "yyyy years MM months",
		weeks : "yyyy years MM months dd-{dd} day",
		days : "yyyy years MM months dd day -dddd",
		week : "week",
		month : "month",
		day : "day",
		today : "today",
		january : "january",
		february : "february",
		march : "march",
		april : "april",
		may : "may",
		june : "june",
		july : "july",
		august : "august",
		september : "september",
		october : "october",
		november : "november",
		december : "december",
		sunday : "sunday",
		monday : "monday",
		tuesday : "tuesday",
		wednesday : "wednesday",
		thursday : "thursday",
		friday : "friday",
		saturday : "saturday",
		allday : "all day",
		dot : "dot",
		schedule : "Schedule content:",
		thing : "Keep a record of what you are going to do...",
		startTime : "Start time...",
		stopTime : "Stop time...",
		choice : "choice",
		current : "current",
		notEmpty : "Contents is not allowed to empty!",
		notTime : "The strat time is not allowed to empty!",
		newEvent : "New event",
		editEvent : "Edit events",
		lnew : "new",
		confirmDel : "Sure delete?"
	},

	tabpanelex : {
		picture : "picture",
		materialOrder : "Material order"
	},

	wizardpanel : {
		previousStep : "Previous step",
		nextStep : "Next step",
		complete : "complete"
	},
	
	dialog : {
		close : "close",
		details : "details",
		wClose : "Whether to shut down",
		yes : "yes",
		no : "no"
	},
	

	pagination : {
		joint : "common",
		totalRecord : "bar record",
		page : "page"
	},

	form : {
		closeInterface : "Are you sure you want to close the interface?"
	},

	request : {
		check : "The request status is uninitialized,check the server connection!"
	},

	opt : {
		warning : "warning",
		form : "form",
		table : "table",
		the : "the",
		line : "line:",
		lineThe : "line,the",
		column : "column:",
		required : "Is required",
		formControl : "Form control",
		noFill : "Is required,the current unfilled value."
	},

	docserviceproxy : {
		notNull : "form cannot be empty"
	},
	
	toolbar : {
		approval : "Revocation has been submitted for examination and approval",
		submit : "Submit a work item",
		via : "via",
		startUp : "Startup process"
	},

	jQueryExt : {
		beyong : "Exceeds specified size!",
		nonType : "Non specified the  type!"
	},

	navigation : {
		application : "Yigo application",
		userName : "wen-wen zhu",
		modfiyPwd : "Modify password",
		version : "versions: ",
		create : "Create number:",
		companyName : "Shanghai boke information limited company",
		authorize : "Authorization:boke information",
		overdueTime : "Expiration date:",
		about : "about Yigo"
	},

	menutree : {
		keyword : "Please input keywords..."
	}

};

if(YIUI.I18N) {
	YIUI.I18N = $.extend(YIUI.I18N, other);
} else {
	YIUI.I18N = other;
}