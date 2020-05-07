package dk.opendesk.repo.utils;

import java.util.Locale;

import org.alfresco.error.AlfrescoRuntimeException;
import org.alfresco.repo.security.authentication.AuthenticationUtil;
import org.alfresco.service.ServiceRegistry;
import org.alfresco.service.cmr.model.FileFolderService;
import org.alfresco.service.cmr.repository.MalformedNodeRefException;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.repository.Path;
import org.alfresco.service.cmr.repository.StoreRef;
import org.alfresco.service.cmr.search.LimitBy;
import org.alfresco.service.cmr.search.ResultSet;
import org.alfresco.service.cmr.search.ResultSetRow;
import org.alfresco.service.cmr.search.SearchParameters;
import org.alfresco.service.cmr.search.SearchService;
import org.alfresco.service.cmr.security.PermissionService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.InitializingBean;

// 
// Copyright (c) 2017-2018, Magenta ApS
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
// 
public class Utils implements InitializingBean{
	

	private static final transient org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(Utils.class);
	
	private ServiceRegistry serviceRegistry;
	public void setServiceRegistry(ServiceRegistry serviceRegistry) {
		this.serviceRegistry = serviceRegistry;
	}

	private SearchService searchService;
	private  NodeService nodeService;
	private PermissionService permissionService;
	private FileFolderService fileFolderService;

	@Override
	public void afterPropertiesSet() throws Exception {
		this.searchService = serviceRegistry.getSearchService();
		this.nodeService = serviceRegistry.getNodeService();
		this.permissionService = serviceRegistry.getPermissionService();
		this.fileFolderService = serviceRegistry.getFileFolderService();
	}	
	
	/**
	 * @href https://hub.alfresco.com/t5/alfresco-content-services-forum/how-to-get-the-path-of-all-the-folders-of-the-sites/td-p/23484
	 * @param nodeRef
	 * @return
	 */
	public static String getDisplayPath(final NodeRef nodeRef,NodeService nodeService,PermissionService permissionService) {
		return AuthenticationUtil.runAs(new AuthenticationUtil.RunAsWork<String>() {
            @Override
            public String doWork() {
            	final Path nodePath = nodeService.getPath(nodeRef);
        		return nodePath.toDisplayPath(nodeService, permissionService);
            }
        }, AuthenticationUtil.getSystemUserName());
	}
	
	/**
	 * 
	 * @param luceneQuery
	 * @param searchService
	 * @param nodeService
	 * @param permissionService
	 * @return
	 */
	public static String getDisplayPath(String luceneQuery, SearchService searchService, NodeService nodeService,PermissionService permissionService, FileFolderService fileFolderService) {
		NodeRef nodeRef = getNodeRefByLuceneQuery(luceneQuery,null,searchService,fileFolderService);
        return getDisplayPath(nodeRef, nodeService, permissionService);
	}
	
	/**
	 * 
	 * @param luceneQuery
	 * @param searchService
	 * @param nodeService
	 * @param permissionService
	 * @return
	 */
	public String getDisplayPath(String luceneQuery) {
		NodeRef nodeRef = getNodeRefByLuceneQuery(luceneQuery,null,this.searchService, this.fileFolderService);
        return getDisplayPath(nodeRef, this.nodeService, this.permissionService);
	}
	
	
    /**
     * 
     * @param luceneQuery
     * @param useDefault
     * @param searchService
     * @return
     */
    public static NodeRef getNodeRefByLuceneQuery(String luceneQuery,String fileName, SearchService searchService, FileFolderService fileFolderService) {
		NodeRef templatenameNodeRef = null;
        try{      	
        	ResultSet results = null;
    		try{   			
	        	SearchParameters sp = new SearchParameters();
	    		//sp.addLocale(new Locale("it", "IT"));
	    		sp.addStore(StoreRef.STORE_REF_WORKSPACE_SPACESSTORE);
	    		sp.setLanguage(SearchService.LANGUAGE_LUCENE);
	    		//sp.setQuery("+PATH:\"/app:company_home/app:dictionary/app:email_templates//*\" +@cm\\:name:\""+luceneQuery+"\"");
	    		if(StringUtils.isNotBlank(fileName)) {
	    			sp.setQuery(luceneQuery + " +@cm\\:name:\""+fileName+"\"");
	    			logger.info("SEARCH: "+luceneQuery + " +@cm\\:name:\""+fileName+"\"");
	    		}else {
	    			sp.setQuery(luceneQuery);
	    			logger.info("SEARCH: "+luceneQuery);
	    		}
	    		
	    		sp.setLimitBy(LimitBy.UNLIMITED);
	    		results = searchService.query(sp);	
	    		
	    		if(results==null || results.length()==0){
	    			if(StringUtils.isNotBlank(fileName)) {
	    				String luceneQuery2 = luceneQuery;
	    				if(luceneQuery2.endsWith("//*")) {
	    					luceneQuery2 = luceneQuery2.substring(0, luceneQuery2.length()-3);
	    				}	    				
	    				SearchParameters sp2 = new SearchParameters();
	    	    		//sp2.addLocale(new Locale("it", "IT"));
	    	    		sp2.addStore(StoreRef.STORE_REF_WORKSPACE_SPACESSTORE);
	    	    		sp2.setLanguage(SearchService.LANGUAGE_LUCENE);	    	    		
	    	    		sp2.setQuery(luceneQuery2);
	    	    		sp2.setLimitBy(LimitBy.UNLIMITED);
			    		NodeRef parentNodeRef = null;
			    		ResultSet results2 = null;
			    		try {
			    			logger.info("SEARCH PARENT: "+luceneQuery2);
				    		results2 = searchService.query(sp2);
				    		if(results2==null || results2.length()==0){
				    			throw new AlfrescoRuntimeException("Results is empty or null for parent : " + luceneQuery2);
				    		}
				    		ResultSetRow row = results2.getRow(0);
				    		parentNodeRef = row.getNodeRef();
			    		}finally {
			    			if(results2!=null) {
			    				results2.close();
			    			}
			    		}
			    		if(parentNodeRef==null) {
			    			throw new AlfrescoRuntimeException("NodeRef is empty or null for parent : " + luceneQuery2);
			    		}	
			    		templatenameNodeRef = fileFolderService.searchSimple(parentNodeRef, fileName);
			    		logger.info("RESULT BY fileFolderService: "+templatenameNodeRef);			    		
	    			}else {
	    				throw new MalformedNodeRefException(luceneQuery);
	    			}
	    		}else {
	    			ResultSetRow row = results.getRow(0);
		    		templatenameNodeRef = row.getNodeRef();
	    		}
	    		logger.info("RESULT: "+templatenameNodeRef);
    		}finally {
    			if(results!=null) {
    				results.close();
    			}
			}       		
        }catch(MalformedNodeRefException ex){
        	throw ex;	
        }
        return templatenameNodeRef ;
    }
    
    /**
     * 
     * @param luceneQuery
     * @param useDefault
     * @param searchService
     * @return
     */
    public NodeRef getNodeRefByLuceneQuery(String luceneQuery) {
    	return getNodeRefByLuceneQuery(luceneQuery, null, this.searchService,this.fileFolderService);
    }
    
    public NodeRef getNodeRefByLuceneQuery(String luceneQuery,String fileName) {
    	return getNodeRefByLuceneQuery(luceneQuery, fileName, this.searchService,this.fileFolderService);
    }

}
