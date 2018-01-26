package dk.opendesk.webscripts;

import dk.opendesk.repo.model.OpenDeskModel;
import dk.opendesk.repo.utils.Utils;
import org.alfresco.model.ContentModel;
import org.alfresco.repo.content.MimetypeMap;
import org.alfresco.repo.model.Repository;
import org.alfresco.service.cmr.model.FileFolderService;
import org.alfresco.service.cmr.model.FileInfo;
import org.alfresco.service.cmr.model.FileNotFoundException;
import org.alfresco.service.cmr.repository.*;
import org.alfresco.service.cmr.security.AuthorityService;
import org.alfresco.service.cmr.security.MutableAuthenticationService;
import org.alfresco.service.cmr.security.PersonService;
import org.alfresco.service.cmr.site.SiteInfo;
import org.alfresco.service.cmr.site.SiteService;
import org.alfresco.service.cmr.site.SiteVisibility;
import org.alfresco.service.cmr.version.Version;
import org.alfresco.service.cmr.version.VersionService;
import org.alfresco.service.namespace.QName;
import org.alfresco.service.transaction.TransactionService;
import org.alfresco.util.PropertyMap;

import java.io.File;
import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TestUtils {

    public static final String STATUS = "status";
    public static final String SUCCESS = "success";
    public static final String NODE_REF = "nodeRef";
    public static final String FILENAME = "fileName";
    public static final String SHORTNAME = "shortName";
    public static final String ADMIN = "admin";

    public static final String USER_ONE = "user_one";
    public static final String USER_ONE_FIRSTNAME = "user";
    public static final String USER_ONE_LASTNAME = "one";
    public static final String USER_ONE_EMAIL = "user_one@testtest.dk";
    public static final String USER_ONE_GROUP = "Site" + OpenDeskModel.COLLABORATOR;
    public static final String USER_TWO = "user_two";
    public static final String USER_THREE = "user_three";
    public static final String USER_FOUR = "user_four";
    public static final String USER_FIVE = "user_five";

    public static final String SITE_ONE = "reserved_for_test_site_one";
    public static final String SITE_ONE_DESC = "This is a fine desc";
    public static final String SITE_TWO = "reserved_for_test_site_two";
    public static final String SITE_THREE = "reserved_for_test_site_three";
    public static final String SITE_FOUR = "reserved_for_test_site_four";
    public static final String SITE_FIVE = "reserved_for_test_site_five";

    public static final String SITE_NAME = "Reserved for test site";

    public static final String FILE_TEST_UPLOAD = "Test_Upload.pdf";
    public static final String FILE_TEST_TEMPLATE1 = "Test_Template1.pdf";
    public static final String FILE_TEST_TEMPLATE2 = "Test_Template2.pdf";
    public static final String FILE_TEST_TEMPLATE3 = "Test_Template3.pdf";
    public static final String FILE_TEST_TEMPLATE4 = "Test_Template4.pdf";
    public static final String FILE_TEST_FROM_TEMPLATE1 = "Test_From_Template1.pdf";
    public static final String FILE_TEST_TEMPLATE1_WITHOUT_EXT = "Test_Template1";

    public static NodeRef createUser(TransactionService transactionService, PersonService personService,
                                  MutableAuthenticationService authenticationService, String userName) {

        return transactionService.getRetryingTransactionHelper().doInTransaction(() -> {
            authenticationService.createAuthentication(userName, "PWD".toCharArray());

            PropertyMap ppOne = new PropertyMap(4);
            ppOne.put(ContentModel.PROP_USERNAME, userName);
            ppOne.put(ContentModel.PROP_FIRSTNAME, "firstName");
            ppOne.put(ContentModel.PROP_LASTNAME, "lastName");
            ppOne.put(ContentModel.PROP_EMAIL, "email@email.com");
            ppOne.put(ContentModel.PROP_JOBTITLE, "jobTitle");

            return personService.createPerson(ppOne);
        });
    }

    public static SiteInfo createSiteTemplate(TransactionService transactionService, SiteService siteService,
                                         NodeService nodeService, String siteShortName){
        return transactionService.getRetryingTransactionHelper().doInTransaction(() ->
                createSiteWithAspect(transactionService, siteService, nodeService, siteShortName,
                        OpenDeskModel.ASPECT_PD_TEMPLATE_SITES));
    }

    public static SiteInfo createPDSite(TransactionService transactionService, SiteService siteService,
                                                 NodeService nodeService, String siteShortName){
        return transactionService.getRetryingTransactionHelper().doInTransaction(() ->
                createSiteWithAspect(transactionService, siteService, nodeService, siteShortName,
                        OpenDeskModel.ASPECT_PD));
    }

    private static SiteInfo createSiteWithAspect(TransactionService transactionService, SiteService siteService,
                                        NodeService nodeService, String siteShortName, QName aspect) {
        SiteInfo s = createSite(siteService, siteShortName, SiteVisibility.PUBLIC);
        Map<QName, Serializable> aspectProps = new HashMap<>();
        TestUtils.addAspect(transactionService, nodeService, s.getNodeRef(), aspect,
                aspectProps);
        return s;
    }

    public static SiteInfo createSite(TransactionService transactionService, SiteService siteService, String siteShortName){
        return transactionService.getRetryingTransactionHelper().doInTransaction(() ->
                createSite(siteService, siteShortName, SiteVisibility.PUBLIC));
    }

    public static SiteInfo createPrivateSite(TransactionService transactionService, SiteService siteService, String siteShortName){
        return transactionService.getRetryingTransactionHelper().doInTransaction(() ->
                createSite(siteService, siteShortName, SiteVisibility.PRIVATE));
    }

    private static SiteInfo createSite(SiteService siteService, String siteShortName, SiteVisibility siteVisibility) {
        SiteInfo s = siteService.createSite("site-dashboard", siteShortName, siteShortName, "desc", siteVisibility);
        siteService.createContainer(siteShortName, OpenDeskModel.DOC_LIBRARY, ContentModel.TYPE_FOLDER, null);
        return s;
    }

    public static NodeRef uploadFile(TransactionService transactionService, ContentService contentService,
                                     FileFolderService fileFolderService, NodeRef parent, String filename) {

        return transactionService.getRetryingTransactionHelper().doInTransaction(() -> {
            File file = new File("src/test/resources/Test_Upload.pdf");

            FileInfo fileInfo = fileFolderService.create(parent, filename, ContentModel.PROP_CONTENT);
            NodeRef node = fileInfo.getNodeRef();

            ContentWriter writer = contentService.getWriter(node, ContentModel.PROP_CONTENT, true);
            writer.setMimetype(MimetypeMap.MIMETYPE_TEXT_PLAIN);
            writer.setEncoding("UTF-8");
            writer.putContent(file);
            return node;
        });
    }

    public static Boolean deleteSite(TransactionService transactionService, SiteService siteService,
                                     AuthorityService authorityService, String siteShortName) {
        return transactionService.getRetryingTransactionHelper().doInTransaction(() -> {
            if(siteService.hasSite(siteShortName))
            siteService.deleteSite(siteShortName);

            String authority = Utils.getAuthorityName(siteShortName, "");
            if (authorityService.authorityExists(authority))
                authorityService.deleteAuthority(authority, true);
            return true;
        });
    }

    public static Boolean deletePerson(TransactionService transactionService, PersonService personService,
                                       String userName) {
        return transactionService.getRetryingTransactionHelper().doInTransaction(() -> {
            personService.deletePerson(userName);
            return true;
        });
    }

    public static Boolean addToAuthority(TransactionService transactionService, AuthorityService authorityService,
                                         String group, String userName) {
        return transactionService.getRetryingTransactionHelper().doInTransaction(() -> {
            authorityService.addAuthority(group, userName);
            return true;
        });
    }

    public static Version createVersion(TransactionService transactionService, VersionService versionService,
                                        NodeRef docRef, Map<String, Serializable> versionProperties) {
        return transactionService.getRetryingTransactionHelper().doInTransaction(() ->
                versionService.createVersion(docRef, versionProperties));
    }

    public static Boolean addAspect(TransactionService transactionService, NodeService nodeService,
                                        NodeRef nodeRef, QName aspect, Map<QName, Serializable> aspectProperties) {
        return transactionService.getRetryingTransactionHelper().doInTransaction(() -> {
            nodeService.addAspect(nodeRef, aspect, aspectProperties);
            return true;
        });
    }

    public static String getIdFromNodeRefStr(String nodeRefStr) {
        return nodeRefStr.split("/")[3];
    }

    public static ChildAssociationRef createFolder(TransactionService transactionService, NodeService nodeService,
                                                    NodeRef parent, String folderName) {
        return transactionService.getRetryingTransactionHelper().doInTransaction(() ->
                nodeService.createNode(parent, ContentModel.ASSOC_CONTAINS, QName.createQName(folderName),
                        ContentModel.TYPE_FOLDER));
    }

    public static NodeRef getDocumentTemplateRef(Repository repository, FileFolderService fileFolderService)
            throws FileNotFoundException {
        NodeRef companyHome = repository.getCompanyHome();
        List<String> docTemplatePath = OpenDeskModel.PATH_NODE_TEMPLATES;
        return fileFolderService.resolveNamePath(companyHome, docTemplatePath).getNodeRef();
    }
}