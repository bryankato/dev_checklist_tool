function getIdFromUrl(url) {
  return url.match(/[-\w]{25,}/);
};

function arrayContains(needle, arrhaystack) {
  return (arrhaystack.indexOf(needle) > -1);
};

function copyToParent(url) {
  var woID = getIdFromUrl(url);
  // Get file ID from URL
  // Get file name
  var woFile = DriveApp.getFileById(woID);
  var woFileName = woFile.getName();
  // Get checklist template file
  var checklistTemplateFile = DriveApp.getFileById('1Uatejqko-I3-C_D_ziLPKB_kMOOtUonw4E9iNgkT5q4');

  // Get workorder parent folder ID
  var parentFolder = woFile.getParents();
  // Get target folder
  var folder = parentFolder.next();
  var folderID = folder.getId();
  var targetFolder = DriveApp.getFolderById(folderID);

  // Copy checklist template to workorder folder
  var userEmail = Session.getActiveUser().getEmail();
  var userEmailSplit = userEmail.split("@");
  var checklistName = woFileName + " | Dev Checklist - " + userEmailSplit[0];
  // Check if checklist already exists
  // Get existing files in parent folder
  var existingFiles = targetFolder.getFiles();
  var existingFileNames = [];
  // Add file names to list
  while (existingFiles.hasNext()) {
    var file = existingFiles.next();
    existingFileNames.push(file.getName());
  };
  // If file name already exists add number to file name
  if (arrayContains(checklistName, existingFileNames)) {
    for(i=1;i < existingFileNames.length;i++) {
      var checklistNameIndexed = checklistName + " (" + i + ")"
      if (!arrayContains(checklistNameIndexed, existingFileNames)) {
        checklistName = checklistNameIndexed;
        break;
      };
    };
  };
  var checkListFile = checklistTemplateFile.makeCopy(checklistName, targetFolder);
  var checkListUrl = checkListFile.getUrl();
  return checkListUrl;
};

function doGet(e) {
  var woUrlEncoded = e.parameter.source;
  var woUrl = decodeURIComponent(woUrlEncoded);
  return ContentService.createTextOutput(copyToParent(woUrl));
};