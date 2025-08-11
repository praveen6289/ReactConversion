import React from 'react';

// --- Helper Functions (emulating Handlebars helpers) ---

// A mock translation function. In a real app, this would come from a library like i18next.
const t = (key, defaultText) => defaultText || key.split('.').pop().replace(/_/g, ' ');

// A mock URL constructor.
const constructUrl = (image, size) => {
  // In a real app, this would point to an actual image resizing service or CDN.
  if (typeof image === 'string' && image.startsWith('http')) {
    return image;
  }
  return `https://via.placeholder.com/174x109.png?text=${image}`;
};

// --- Sub-components (as functions for organization) ---

const OpportunityBanner = ({ org }) => (
  <div
    className="opportunity-banner-section"
    style={{
      backgroundImage: `url('${org.organization_banner_logo || 'https://vmark-prod-ww.s3.amazonaws.com/1628b46b-99a6-42a0-b706-3b93959e09e8-coverphoto.png'}')`
    }}
  >
    &nbsp;
  </div>
);

const OrganizationSidebar = ({ org, similarresult, hierarchySlugName }) => (
  <div className="col-sm-3 pull-left">
    <section className="bg-white m-b-25 min-height--340 margin-top-negative p-20">
      <p className="op-subheading m-b-20">{t('public.about_organization', 'About Organization')}</p>
      <div className="op-orglogo m-b-16">
        <img src={org.organization_logo} alt={`${org.orgname} Logo`} />
      </div>
      <p className="op-orgname m-b-0">{org.orgname}</p>
      <p className="fs-14 text-lb-gray">{org.organization_address}.</p>
      <a href={org.eachPageHierarchy ? `/${org.slugname}/${hierarchySlugName || ''}` : `/${org.slugname}`} className="op-anchor" target="_blank" rel="noopener noreferrer">
        + {t('public.more_opportunities', 'More Opportunities')}
      </a>
    </section>

    {!org.hidesimilaropps && (
      <section className="bg-white min-height--230 m-b-25 p-20 similarhide">
        {similarresult && similarresult.length > 0 ? (
          <>
            <p className="op-subheading m-b-20">{t('public.similar_opportunities', 'Similar Opportunities')}</p>
            <div className="row m-b-25">
              {similarresult.map((similar) => (
                <div className="new-similar-opp nosponsor" key={similar.slug}>
                  <p className="fs-14 text-lb-gray col-xs-12">
                    <a href={`/${org.slugname}/${hierarchySlugName ? `${hierarchySlugName}/` : ''}${similar.slug}`} target="_blank" rel="noopener noreferrer">
                      {similar.position_name || similar.event_title}
                    </a>
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="row m-b-25 no-similaritems">
            <div className="new-similar-opp nosponsor">
              <p className="fs-14 text-lb-gray col-xs-12">{t('public.no_similar_opportunities_yet', 'No Similar Opportunities Yet')}</p>
            </div>
          </div>
        )}
      </section>
    )}
  </div>
);

const SponsorTabContent = ({ sponsorlogo }) => {
    const hasSponsors = sponsorlogo && sponsorlogo.length > 0;

    return (
        <div role="tabpanel" className="tab-pane spon-logo-new-br" id="sponsor-tab">
            {!hasSponsors && (
                <div className="text-center nosponsor" id="nosponsor-yet">
                    <span><img src="../img/Opportinity/no-image.png" alt="no sponsors" /></span>
                    <p className="p-t-30">{t('public.organization_doesnt_have_any_sponsors_yet', "Organization doesn't have any sponsors yet")}</p>
                </div>
            )}
            <div id="sponsertab">
                {sponsorlogo && sponsorlogo.map((sponsorPlan, index) => {
                    let sponsorClass = '';
                    if (sponsorPlan.plan_type === 'large') sponsorClass = 'col-xs-12 col-sm-6 sponsor-cards sponsor-full-view';
                    else if (sponsorPlan.plan_type === 'medium') sponsorClass = 'col-xs-6 col-sm-3 sponsor-cards sponsor-full-view';
                    else if (sponsorPlan.plan_type === 'small') sponsorClass = 'col-xs-4 col-sm-2 sponsor-cards';

                    return (
                        <div key={index}>
                            <h2 className="m-t-10 text-left">{sponsorPlan.plan_name}</h2>
                            <div className="row sponser-bor sponser-bor-royal">
                                {sponsorPlan.data.map(sponsor =>
                                    sponsor.imgLink.map(img => (
                                        <div className={sponsorClass} key={img.imglink}>
                                            <div className="sponsor-card-logo">
                                                {sponsor.sponsor_site ? (
                                                    <a href={sponsor.sponsor_site} title={sponsor.sponsor_name} target="_blank" rel="noopener noreferrer">
                                                        <img src={img.imglink} alt={sponsor.name} />
                                                    </a>
                                                ) : (
                                                    <img src={img.imglink} alt={sponsor.name} />
                                                )}
                                            </div>
                                            <h5>{sponsor.name}</h5>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const OpportunityTabs = ({ opportunity, org }) => (
  <div className="opportunity-tab-main" id="tab2">
    <ul className="nav nav-tabs" role="tablist">
      <li role="presentation" className="active" id="info_tab"><a href="#info" aria-controls="home" role="tab" data-toggle="tab">{t('public.info', 'Info')}</a></li>
      {!org.custom_features?.disable_photos &&
        <li role="presentation" id="photo_tab"><a href="#photos" aria-controls="profile" role="tab" data-toggle="tab">{t('public.photos', 'Photos')}</a></li>
      }
      {!org.custom_features?.disable_doc &&
        <li role="presentation" id="document_tab"><a href="#documents" aria-controls="profile" role="tab" data-toggle="tab">{t('public.documents', 'Documents')}</a></li>
      }
       <li role="presentation" id="sponsortab"><a href="#sponsor-tab" aria-controls="profile" role="tab" data-toggle="tab">{t('org.sponsors', 'Sponsors')} <sub className="sponsor-stars sponsor-stars-top"><i>&nbsp;</i><i>&nbsp;</i><i>&nbsp;</i></sub></a></li>
    </ul>
    <div className="tab-content dc-zindex">
      <div role="tabpanel" className="tab-pane active" id="info">
        <p className="fs-14 text-lb-gray" dangerouslySetInnerHTML={{ __html: opportunity.position_description || opportunity.event_details }} />
      </div>
      <div role="tabpanel" className="tab-pane" id="photos">
        {/* Photo upload UI can be a separate component */}
        <div className="row js-positionimages">
          {(opportunity.images && opportunity.images.length > 0) ? (
            opportunity.images.slice(0, 3).map((img, index) => (
              <div className="col-md-4 col-sm-4 col-xs-12" key={index}>
                <span className="box-ctrl"><img src={constructUrl(img.image, '174x109')} className="quikverify" alt="opportunity" /></span>
              </div>
            ))
          ) : (
            <div className="no-photos col-xs-12 text-center">
                <span><img src="../img/Opportinity/no-image.png" alt="no photos" /></span>
                <p className="m-t-30">{t('public.no_photos_uploaded_yet', 'No photos uploaded yet')}</p>
            </div>
          )}
        </div>
      </div>
      <div role="tabpanel" className="tab-pane" id="documents">
         <div className="row js-positiondocument">
            {(opportunity.docs && opportunity.docs.length > 0) ? (
                opportunity.docs.map((doc, index) => (
                    <div className="col-md-6 col-sm-6 col-xs-12" key={index}>
                        <span className="box-ctrl doc">
                            <iframe src={`https://docs.google.com/gview?url=${doc.doc}&embedded=true`} frameBorder="0" scrolling="no" width="100%" height="200" title={doc.doc}></iframe>
                            <span className="document-actions">
                                <div><a href={doc.doc} download className="link-white"><i className="material-icons">get_app</i></a></div>
                            </span>
                        </span>
                    </div>
                ))
            ) : (
                <div className="no-photos no-docs col-xs-12 text-center">
                    <span><img src="../img/Opportinity/no-image.png" alt="no documents" /></span>
                    <p className="m-t-30 text-muted">{t('public.no_documents_uploaded_yet', 'No documents uploaded yet')}</p>
                </div>
            )}
         </div>
      </div>
      <SponsorTabContent sponsorlogo={opportunity.sponsorlogo} />
    </div>
  </div>
);

const OpportunityDetails = ({ pageType, opportunity, org, oemail }) => {
  const title = pageType === 'position' ? opportunity.position_name : opportunity.event_title;
  let shiftLabel = '';
  if (pageType === 'position') {
      shiftLabel = opportunity.reccuringDetails ? t('public.fixed_shifts', 'Fixed Shifts') : t('public.flexible_shifts', 'Flexible Shifts');
  } else {
      shiftLabel = t('public.one_time_event', 'One-Time Event');
  }

  return (
    <div className="col-sm-8 b-right min-height--700">
      <div className="row">
        <div className="col-sm-12 m-b-25">
          <h1 className="op-header" id="positionname">{title}</h1>
          <div>
            <span className="shift-label">{shiftLabel}</span>
            <div className="pull-right">
              {/* Favorite buttons would have state and onClick handlers */}
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Details Rendering */}
      {pageType === 'position' && (
          <div>
            {opportunity.reccuringDetails && (
                <div className="row">
                    <div className="col-sm-6 col-xs-6"><p className="fs-14">{t('common.shift_type', 'Shift Type')}:</p></div>
                    <div className="col-sm-6 col-xs-6"><p className="fs-14 text-lb-gray">{opportunity.reccuringDetails.type}</p></div>
                </div>
            )}
            {/* ... other position-specific fields like occurrence, commitment_time etc. */}
          </div>
      )}

      {pageType === 'event' && (
          <div>
            <div className="row">
                <div className="col-sm-6 col-xs-6"><p className="fs-14">{t('common.time', 'Time')}:</p></div>
                <div className="col-sm-6 col-xs-6"><p className="fs-14 text-lb-gray">{opportunity.eventMonthDate}, {opportunity.eventStartTime} - {opportunity.eventEndTime}</p></div>
            </div>
          </div>
      )}

      {opportunity.timezonedata && (
        <div className="row">
            <div className="col-sm-6 col-xs-6"><p className="fs-14">{t('public.opportunity_timezone', 'Timezone')}:</p></div>
            <div className="col-sm-6 col-xs-6"><p className="fs-14 text-lb-gray">{opportunity.timezonedata}</p></div>
        </div>
      )}

      <div className="row">
        <div className="col-sm-6 col-xs-6"><p className="fs-14">{t('public.location', 'Location')}:</p></div>
        <div className="col-sm-6 col-xs-6">
            <p className="fs-14 text-lb-gray">
                {opportunity.positionaddress || `${org.organization_address}, ${org.organization_city}, ${org.organization_state}`}
            </p>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12">
            <OpportunityTabs opportunity={opportunity} org={org} />
        </div>
      </div>
    </div>
  );
};

const ActionsSidebar = ({ pageType, opportunity, org, oemail, donationEnabled }) => {
    // This component would have complex logic for button states (disabled, filled, waitlist, etc.)
    // For brevity, a simplified version is shown.
    const isInactive = !org.org_active_subscription;

    return (
        <div className="col-sm-4 min-height--700 border-left-ctrl">
            <div className="row">
                <div className="col-sm-12 p-r-0">
                    {isInactive ? (
                         <span className="btn btn-green btn-block m-t-20 m-b-16 fw-500 fs-18 disabled">{t('public.organization_inactive', 'Organization Inactive')}</span>
                    ) : (
                         <a href="#" className="btn btn-green btn-block m-t-20 m-b-16 fw-500 fs-18 oppertunitysignup">{t('public.sign_up_now', 'Sign Up Now')}</a>
                    )}

                    {donationEnabled && (
                        <div className="placeholderdonate">
                            <a href="#" className="btn btn-warning btn-block m-t-20 m-b-16 fw-500 fs-18 js-donate">
                                {t('public.Donate_Now', 'Donate Now')}
                            </a>
                        </div>
                    )}
                    <a href={`mailto:${oemail}`} className="btn btn-default btn-block m-b-25 fw-500 fs-18">{t('public.contact_us', 'Contact Us')}</a>
                </div>
            </div>

            {/* Volunteer Opportunity For Section */}
            {/* ... This section is mostly static with a few conditions ... */}

            {/* Sponsors Right Block */}
            <div className="sponsor-right-block opportunity-social-icons clearfix min-height--230" id="sponsorship">
                <h3 className="m-b-10 pos-rel-inline">{t('public.our_sponsors', 'Our Sponsors')} <sub className="sponsor-stars"><i>&nbsp;</i><i>&nbsp;</i><i>&nbsp;</i></sub></h3>
                {/* ... Sponsor slider logic ... */}
            </div>

            {/* Share Buttons */}
             {!org.custom_features?.disable_social_icons && (
                <div className="opportunity-social-icons col-sm-12">
                    <strong className="m-b-10">{t('public.share_opportunity', 'Share Opportunity')}</strong>
                    {/* Social sharing components would go here */}
                </div>
             )}
        </div>
    );
};


// --- Main Component ---

const OpportunityPublicPage = ({
  org,
  opportunity,
  similarresult,
  sponsorlogo,
  offsetminutes,
  offsettime,
  oemail,
  hierarchySlugName,
  pageType, // 'position' or 'event'
  donationEnabled,
  // This would be derived from user session
  isLoggedIn,
  isAuthorized
}) => {

  const jsonData = JSON.stringify(opportunity);
  // In a real app, you'd likely use a state management library or context for some of these.
  const isPrivate = org.makeorgposprivate && !isAuthorized;

  // Combine sponsor logos into opportunity object for easier prop drilling
  if (sponsorlogo) {
      opportunity.sponsorlogo = sponsorlogo;
  }

  return (
    <div className="publicpositions">
      <OpportunityBanner org={org} />
      <div className="container m-t-20">
        {/* Hidden data spans for legacy JS interop */}
        <span className="hide" data-offsetminutes={offsetminutes} data-offsettime={offsettime} data-position={jsonData} data-type={pageType} data-slug={opportunity.slug} id="organizationidone">{org._id}</span>

        <div className="row">
          <OrganizationSidebar org={org} similarresult={similarresult} hierarchySlugName={hierarchySlugName} />

          <div className="col-sm-9 pull-right">
            {isPrivate ? (
                <div className="bg-white js-unauthorized" style={{ padding: '50px 15px' }}>
                    {/* Unauthorized/Login prompt component would go here */}
                    <p>This opportunity is private. Please log in to view.</p>
                </div>
            ) : (
                <div className="bg-white js-hideifprivate m-b-25 oppurtunitydetails" style={{ float: 'left', width: '100%' }}>
                    <OpportunityDetails pageType={pageType} opportunity={opportunity} org={org} oemail={oemail} />
                    <ActionsSidebar pageType={pageType} opportunity={opportunity} org={org} oemail={oemail} donationEnabled={donationEnabled} />
                </div>
            )}

            {/* Calendar / Shift list would be rendered here based on pageType and opportunity data */}
            {pageType === 'position' && opportunity.reccuringDetails && (
                <div className="col-sm-9 bg-white min-height--700 pull-right m-b-25 newcaldisplay">
                    {/* Calendar Component */}
                    <p>Calendar view for recurring position would be here.</p>
                </div>
            )}

            {pageType === 'event' && opportunity.shifts && (
                 <div className="col-sm-9 bg-white min-height--700 pull-right m-b-25 newcaldisplay">
                    {/* Shift List Component */}
                     <p>Shift list for event would be here.</p>
                 </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityPublicPage;
