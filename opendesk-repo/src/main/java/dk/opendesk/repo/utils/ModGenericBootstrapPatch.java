package dk.opendesk.repo.utils;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import org.alfresco.repo.admin.patch.impl.GenericBootstrapPatch;
import org.alfresco.repo.importer.ImporterBootstrap;
import org.alfresco.repo.module.ImporterModuleComponent;
import org.alfresco.repo.module.ModuleVersionNumber;
import org.alfresco.service.cmr.admin.PatchException;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.StoreRef;
import org.alfresco.service.cmr.view.ImporterException;
import org.alfresco.service.cmr.view.ImporterBinding.UUID_BINDING;
import org.apache.commons.lang3.StringUtils;
import org.springframework.extensions.surf.util.I18NUtil;

import dk.opendesk.repo.beans.NodeBean;

/**
 * Classe di utility che estende {@link org.alfresco.repo.admin.patch.impl.GenericBootstrapPatch}
 * per l'importo dinamico dei file ACP su Alfresco
 * prevede casi d'uso non previsti dai meccanismi di default di Alfresco
 * nello specifico il settaggio esplicito del'uuidbinding
 * 
 * @usage
 * 	&lt;bean id=&quot;alvex-workflow-permissions-templates-bootstrap&quot; 
 *				class=&quot;org.alfresco.repo.admin.patch.impl.GenericBootstrapPatch&quot; parent=&quot;basePatch&quot;&gt;
 *		&lt;property name=&quot;id&quot; value=&quot;alvex-workflow-permissions-config&quot; /&gt;
 *		&lt;property name=&quot;description&quot; value=&quot;Alvex workflow permissions templates - used for setting default available workflows&quot; /&gt;
 *		&lt;property name=&quot;fixesFromSchema&quot;&gt;&lt;value&gt;0&lt;/value&gt;&lt;/property&gt;
 *		&lt;property name=&quot;fixesToSchema&quot;&gt;&lt;value&gt;${version.schema}&lt;/value&gt;&lt;/property&gt;
 *		&lt;property name=&quot;targetSchema&quot;&gt;&lt;value&gt;99000&lt;/value&gt;&lt;/property&gt;
 *		&lt;property name=&quot;importerBootstrap&quot;&gt;
 *			&lt;ref bean=&quot;spacesBootstrap&quot; /&gt;
 *		&lt;/property&gt;
 *		&lt;property name=&quot;checkPath&quot;&gt;
 *			&lt;value&gt;/${spaces.company_home.childname}/${spaces.dictionary.childname}/app:alvex&lt;/value&gt;
 *		&lt;/property&gt;
 *		&lt;property name=&quot;bootstrapView&quot;&gt;
 *			&lt;props&gt;
 *				&lt;prop key=&quot;path&quot;&gt;/${spaces.company_home.childname}/${spaces.dictionary.childname}&lt;/prop&gt;
 *				&lt;prop key=&quot;location&quot;&gt;alfresco/module/${project.artifactId}/bootstrap/alvex-workflow-permissions.xml&lt;/prop&gt;
 *			&lt;/props&gt;
 *		&lt;/property&gt;
 *	&lt;/bean&gt;
 */
public class ModGenericBootstrapPatch extends GenericBootstrapPatch{
	
	private static transient final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(ModGenericBootstrapPatch.class);
	
    protected String checkNamePath;

    public void setCheckNamePath(String checkNamePath) {
        this.checkNamePath = checkNamePath;
        setCheckPath(checkNamePath);
    }

    private NodeBean nodeBean;

    public void setNodeBean(NodeBean nodeBean) {
        this.nodeBean = nodeBean;
    }
    
    private String fixesFromSchemaS;
    private String fixesToSchemaS;
    private String targetSchemaS;
 
    /**
     * Set the smallest schema number that this patch may be applied to.
     * 
     * @param version
     *            a schema number not smaller than 0
     */
    public void setFixesFromSchemaS(String version)
    {    	
    	int flag = 0;
    	setFixesFromSchema(flag);
    }

    /**
     * Set the largest schema version number that this patch may be applied to.
     * 
     * @param version
     *            a schema version number not smaller than the {@link #setFixesFromSchema(int) from version} number.
     */
    public void setFixesToSchemaS(String version)
    {
    	int flag = 0;
    	try {
    		flag = Integer.parseInt(version);
    		if(flag>0) {
    			setFixesToSchema(flag);
    		}else { 		
        		flag = convertVersionToInt(version);
        		if(flag>0) {
        			setFixesToSchema(flag);
        		}else {
        			throw new NumberFormatException("Can't recover a valid number from project.version:"+version);
        		}
    		}
    	}catch(NumberFormatException ex) {
    		flag = convertVersionToInt(version);
    		setFixesToSchema(flag);
    	}
    }

    /**
     * Set the schema version that this patch attempts to take the existing schema to. This is for informational
     * purposes only, acting as an indicator of intention rather than having any specific effect.
     * 
     * @param version
     *            a schema version number that must be greater than the {@link #fixesToSchema max fix schema number}
     */
    public void setTargetSchemaS(String version)
    {
    	int flag = 99999999;
    	setTargetSchema(flag);
    }
    
    //SETTER DI SUPPORTO PER ImportModuleComponenet
    
//    /**
//     * Set the version number for which this component was added.
//     */
//    public void setSinceVersion(String version)
//    {
//        //DO NOTHING
//    }
//
//    /**
//     * Set the minimum module version number to which this component applies.
//     * Default <b>0.0</b>.
//     */
//    public void setAppliesFromVersion(String version)
//    {
//        setFixesFromSchema(version);
//    }
//
//    /**
//     * Set the minimum module version number to which this component applies.
//     * Default <b>999.0</b>.
//     */
//    public void setAppliesToVersion(String version)
//    {
//    	setFixesToSchema(version);
//    	//setTargetSchema(version);
//    }


    @Override
    protected String applyInternal() throws Exception
    {
        StoreRef storeRef = importerBootstrap.getStoreRef();
       
        UUID_BINDING uuidBinding = null;
        String viewUuidBinding = bootstrapView.getProperty( ImporterBootstrap.VIEW_UUID_BINDING);
        if (viewUuidBinding != null && viewUuidBinding.length() > 0)
        {
            try
            {
            	uuidBinding = UUID_BINDING.valueOf(UUID_BINDING.class, viewUuidBinding);
            }
            catch(IllegalArgumentException e)
            {
                throw new ImporterException("The value " + viewUuidBinding + " is an invalid uuidBinding");
            }
        }

        NodeRef rootNodeRef = nodeService.getRootNode(storeRef);
        if (checkPath != null)
        {
            List<NodeRef> results = searchService.selectNodes(
                    rootNodeRef,
                    checkPath,
                    null,
                    namespaceService,
                    false);
            if (results.size() > 1)
            {
                throw new PatchException(ERR_MULTIPLE_FOUND, checkPath);
            }
            else if (results.size() == 1)
            {
            	if(uuidBinding!=null) {
            		if(uuidBinding.equals(UUID_BINDING.CREATE_NEW) ||
            				uuidBinding.equals(UUID_BINDING.CREATE_NEW_WITH_UUID)) {
	            		// nothing to do - it exists
	            		return I18NUtil.getMessage(MSG_EXISTS, checkPath);
            		}
            	}else {
            		// nothing to do - it exists
            		return I18NUtil.getMessage(MSG_EXISTS, checkPath);
            	}                
            }else {
            	uuidBinding = null; //DEFAULT IMPORT ACP
            }
        }
        String path = bootstrapView.getProperty(ImporterBootstrap.VIEW_PATH_PROPERTY);
        logger.info("Run PATCH:\n" + 
        		"ID="+getId()+"\n"+
        		",PATH="+path+"\n" +
        		",UUIDBinding="+uuidBinding+"\n"+
        		//",boostrapView="+getPropertyAsString(bootstrapView)+"\n"+
        		",FixesFromSchema="+getFixesFromSchema()+"\n"+
        		",FixesToSchema="+getFixesToSchema()+"\n"+
        		",TargetSchema="+getTargetSchema()+"\n"
        		
        );      
        List<Properties> bootstrapViews = new ArrayList<Properties>(1);
        bootstrapViews.add(bootstrapView);
        // modify the bootstrapper
        importerBootstrap.setBootstrapViews(bootstrapViews);
        importerBootstrap.setUseExistingStore(true);              // allow import into existing store

        if(uuidBinding!=null) {
        	importerBootstrap.setUuidBinding(uuidBinding);
        }
        
        importerBootstrap.bootstrap();
        // done
        return I18NUtil.getMessage(MSG_CREATED, path, rootNodeRef);
    }
    
	private String getPropertyAsString(Properties prop) {    
	  StringWriter writer = new StringWriter();
	  prop.list(new PrintWriter(writer));
	  return writer.getBuffer().toString();
	}

	private int convertVersionToInt(String version) throws NumberFormatException{
		int flag = 0;
		
		String version2 = version;
		version2 = version2
				.replace("-","")
				.replace(".","")
				.replace("SNAPSHOT", "");
		if(version2.length()<=8) {			
			flag = Integer.parseInt(version2);
		}else {
			version2 = version2.substring(4,12);
			flag = Integer.parseInt(version2);
		}
	
		return flag;
	}

}
