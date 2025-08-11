import React from 'react';
import { Container, Row, Col, Image, Tabs, Tab, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DfaultUserLogo from '../../assets/images/publicPages/default_user.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faUpload, faGavel, faGraduationCap, faGlobe, faHeart, faPrint } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from "react-i18next";

const OpportunityPage = ({ data }) => {
    // Defensive check for data prop
    if (!data || !data.org) {
        return <div>Loading... or an error occurred.</div>;
    }

    const { t } = useTranslation();
    const lookup = t;

    const pageType = data.pageType;
    const title = pageType === 'position' ? data.position_name : data.event_title;
    const description = pageType === 'position' ? data.position_description : data.event_details;
    const bannerImage = data.org?.organization_banner_logo || 'https://vmark-prod-ww.s3.amazonaws.com/1628b46b-99a6-42a0-b706-3b93959e09e8-coverphoto.png';

    let shiftLabel = '';
    if (pageType === 'position') {
        shiftLabel = data.reccuringDetails ? lookup('public.fixed_shifts', 'Fixed Shifts') : lookup('public.flexible_shifts', 'Flexible Shifts');
    } else {
        shiftLabel = lookup('public.one_time_event', 'One-Time Event');
    }

    const isSignUpBlocked = pageType === 'position' && data.org.block_volunteer_signup && data.reccuringDetails;
    const isPrivateAndUnauthorized = data.org.makeorgposprivate && !data.isAuthorized;

    const renderSignUpButton = () => {
        if (!data.org?.org_active_subscription) {
            return <Button variant='primary' size="lg" className='w-100 d-block my-3' disabled>{lookup('public.organization_inactive', 'Organization Inactive')}</Button>;
        }
        if (data.org?.loginRequired) {
            return <Button variant='primary' size="lg" className='w-100 d-block my-3'>{lookup('public.sign_in', 'Sign In')}</Button>;
        }
        if (pageType === 'event') {
            if (data.lockSignups) return null;
            if (data.event_filled) return <Button variant='secondary' size="lg" className='w-100 d-block my-3' disabled>{lookup('public.event_is_filled', 'Event is Filled')}</Button>;
        }
        if (pageType === 'position') {
            if (data.filled) {
                if (data.org.backupbot) {
                    return <Button variant='primary' size="lg" className='w-100 d-block my-3'>{lookup('public.join_waitlist', 'Join Waitlist')}</Button>;
                }
                return <Button variant='secondary' size="lg" className='w-100 d-block my-3' disabled>{lookup('public.filled_up', 'Filled Up')}</Button>;
            }
        }
        if (data.org.donationRequired) return null;
        return <Button variant='primary' size="lg" className='w-100 d-block my-3'>{lookup('public.sign_up_to_apply', 'Sign up to apply')}</Button>;
    };

    return (
        <>
            <div className="opportunity-banner-section" style={{ backgroundImage: `url('${bannerImage}')` }}>&nbsp;</div>
            <section className='bg-light-gray py-4'>
                <Container>
                    <Row>
                        <Col md={3}>
                            <section className="bg-white mb-4 p-3 shadow-sm rounded mt-n5">
                                <p className="text-black mb-3 fw-bold">{lookup('public.about_organization', 'About Organization')}</p>
                                <div className="border p-2 mb-3 text-center">
                                    <Image src={data.org.organization_logo} alt={`${data.org.orgname} logo`} style={{ maxWidth: '150px' }} fluid />
                                </div>
                                <h5 className='text-black'>{data.org.orgname}</h5>
                                <p className='my-2 text-muted'>{data.org.organization_address}.</p>
                                <a href={data.org.eachPageHierarchy ? `/${data.org.slugname}/${data.hierarchySlugName || ''}` : `/${data.org.slugname}`} className="op-anchor fs-17" target="_blank" rel="noreferrer">
                                    + {lookup("public.more_opportunities", 'More Opportunities')}
                                </a>
                            </section>

                            {!data.org.hidesimilaropps && (
                                <section className="bg-white mb-4 p-3 shadow-sm rounded">
                                    <p className="op-subheading m-b-20 fw-bold">{lookup("public.similar_opportunities", 'Similar Opportunities')}</p>
                                    {Array.isArray(data.similarresult) && data.similarresult.length > 0 ? (
                                        <div>
                                            {data.similarresult.map((item) => (
                                                <div className="new-similar-opp nosponsor" key={item.slug}>
                                                    <p className="fs-14 text-lb-gray">
                                                        <a href={`/${data.org.slugname}/${item.hierarchySlugName ? `${item.hierarchySlugName}/` : ''}${item.slug}`} target="_blank" rel="noopener noreferrer">
                                                            {item.position_name || item.event_title}
                                                        </a>
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="fs-14 text-muted">{lookup("public.no_similar_opportunities_yet", 'No Similar Opportunities Yet')}</p>
                                    )}
                                </section>
                            )}
                        </Col>

                        <Col md={9}>
                             {isPrivateAndUnauthorized ? (
                                <div className="bg-white p-5 text-center shadow-sm rounded">
                                    <p>{lookup('public.private_opportunity_login_prompt', 'This is a private opportunity. Please login to view the details.')}</p>
                                    <Button variant='primary'>{lookup('public.login', 'Login')}</Button>
                                </div>
                             ) : (
                            <div className="bg-white" style={{ display: isSignUpBlocked ? 'none' : 'block' }}>
                                <Row>
                                    <Col md={8} className='p-4 border-end'>
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <h2 className='text-black'>{title}</h2>
                                                <small className='px-2 py-1 fs-10 text-white rounded shift-label lh-18 d-inline-block'>{shiftLabel}</small>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <Button variant="link" className="text-secondary"><FontAwesomeIcon icon={faHeart} /> {lookup('public.add_to_my_favourites', 'Add to Favourites')}</Button>
                                                <Button variant="link" className="text-secondary"><FontAwesomeIcon icon={faPrint} /> {lookup('public.print', 'Print')}</Button>
                                            </div>
                                        </div>

                                        <div className='mt-4 border-top'>
                                            {pageType === 'position' ? (
                                                <div className="py-2">
                                                    {data.reccuringDetails && (
                                                        <Row><Col xs={5}><strong>{lookup('common.shift_type', 'Shift Type')}:</strong></Col><Col xs={7}>{data.reccuringDetails.type}</Col></Row>
                                                    )}
                                                    {data.reccuringDetails && !data.hideOccurence && (
                                                         <Row><Col xs={5}><strong>{lookup('common.occurrence', 'Occurrence')}:</strong></Col><Col xs={7}>{data.summery}</Col></Row>
                                                    )}
                                                     <Row><Col xs={5}><strong>{lookup('public.commitment_time', 'Commitment')}:</strong></Col><Col xs={7}>{data.commitment_time}</Col></Row>
                                                </div>
                                            ) : (
                                                <div className="py-2">
                                                    <Row><Col xs={5}><strong>{lookup('common.time', 'Time')}:</strong></Col><Col xs={7}>{data.eventMonthDate}, {data.eventStartTime} - {data.eventEndTime}</Col></Row>
                                                </div>
                                            )}

                                            {data.timezonedata && (
                                                 <Row><Col xs={5}><strong>{lookup('public.opportunity_timezone', 'Timezone')}:</strong></Col><Col xs={7}>{data.timezonedata}</Col></Row>
                                            )}

                                            <Row><Col xs={5}><strong>{lookup('public.volunteers_need_per_day', 'Volunteers Needed')}:</strong></Col><Col xs={7}>{data.volunteer_capacity || lookup('org.no_limit', 'No Limit')}</Col></Row>
                                            <Row><Col xs={5}><strong>{lookup('org.skills', 'Skills')}:</strong></Col><Col xs={7}>{data.skills}</Col></Row>
                                            <Row><Col xs={5}><strong>{lookup('public.location', 'Location')}:</strong></Col>
                                                <Col xs={7}>
                                                    {pageType === 'position' ?
                                                        (data.positionaddress || `${data.org.organization_address}, ${data.org.organization_city}, ${data.org.organization_state}`) :
                                                        `${data.eventVenue}, ${data.eventAddress}, ${data.eventCity}, ${data.eventState}`
                                                    }
                                                </Col>
                                            </Row>
                                        </div>

                                        <Tabs className='my-3 normal-tab public-page-tabs' id='publicPageTabs' defaultActiveKey="info">
                                            <Tab eventKey="info" title={lookup('public.info', 'Info')} className="py-3">
                                                <div dangerouslySetInnerHTML={{ __html: description }} />
                                            </Tab>
                                            {!data.org.custom_features?.disable_photos && (
                                                <Tab eventKey="photos" title={lookup('public.photos', 'Photos')} className="py-3">
                                                    <div className="text-end mb-3">
                                                        <Button variant="outline-secondary"><FontAwesomeIcon icon={faUpload} /> {lookup('public.upload_photos', 'Upload Photos')}</Button>
                                                    </div>
                                                    {Array.isArray(data.images) && data.images.length > 0 ? (
                                                        <Row>
                                                            {data.images.map((img, index) => (
                                                                <Col md={4} key={index} className="mb-3">
                                                                    <Image src={img.image} fluid rounded />
                                                                </Col>
                                                            ))}
                                                        </Row>
                                                    ) : (
                                                        <div className='text-center py-5 text-muted'>
                                                            <FontAwesomeIcon icon={faImage} className='display-5' />
                                                            <p className='my-3 fs-16'>{lookup('public.no_photos_uploaded_yet', 'No photos uploaded yet.')}</p>
                                                        </div>
                                                    )}
                                                </Tab>
                                            )}
                                            {!data.org.custom_features?.disable_doc && (
                                                <Tab eventKey="docs" title={lookup('public.documents', 'Documents')} className="py-3">
                                                    <div className="text-end mb-3">
                                                        <Button variant="outline-secondary"><FontAwesomeIcon icon={faUpload} /> {lookup('org.upload_documents', 'Upload Documents')}</Button>
                                                    </div>
                                                     {Array.isArray(data.docs) && data.docs.length > 0 ? (
                                                        <Row>
                                                            {data.docs.map((doc, index) => (
                                                                <Col md={6} key={index} className="mb-3">
                                                                    <iframe src={`https://docs.google.com/gview?url=${doc.doc}&embedded=true`} width="100%" height="200px" title={doc.doc} className="border"></iframe>
                                                                </Col>
                                                            ))}
                                                        </Row>
                                                    ) : (
                                                        <div className='text-center py-5 text-muted'>
                                                            <FontAwesomeIcon icon={faImage} className='display-5' />
                                                            <p className='my-3 fs-16'>{lookup('public.no_documents_uploaded_yet', 'No documents uploaded yet.')}</p>
                                                        </div>
                                                    )}
                                                </Tab>
                                            )}
                                            <Tab eventKey="sponsors" title={lookup('org.sponsors', 'Sponsors')} className="py-3">
                                                {Array.isArray(data.sponsorlogo) && data.sponsorlogo.length > 0 ? (
                                                    data.sponsorlogo.map((plan, i) => (
                                                        <div key={i} className="mb-4">
                                                            <h4 className="text-black">{plan.plan_name}</h4>
                                                            <Row>
                                                                {Array.isArray(plan.data) && plan.data.map(sponsor => (
                                                                    Array.isArray(sponsor.imgLink) && sponsor.imgLink.map(img => (
                                                                        <Col xs={plan.plan_type === 'large' ? 6 : plan.plan_type === 'medium' ? 4 : 3} key={img.imglink} className="mb-3 text-center">
                                                                            <a href={sponsor.sponsor_site} target="_blank" rel="noopener noreferrer">
                                                                                <Image src={img.imglink} alt={sponsor.name} fluid />
                                                                                <h6 className="mt-2">{sponsor.name}</h6>
                                                                            </a>
                                                                        </Col>
                                                                    ))
                                                                ))}
                                                            </Row>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>{lookup('public.organization_doesnt_have_any_sponsors_yet', "Organization doesn't have any sponsors yet.")}</p>
                                                )}
                                            </Tab>
                                        </Tabs>
                                    </Col>

                                    <Col md={4} className='p-4'>
                                        {renderSignUpButton()}
                                        {data.donationEnabled && <Button variant='warning' size='lg' className='w-100 d-block mb-3 text-black'>{lookup('public.Donate_Now', 'Donate Now')}</Button>}
                                        <Button href={`mailto:${data.oemail}`} variant='outline-secondary' size='lg' className='w-100 d-block mb-3 text-black'>{lookup('public.contact_us', 'Contact Us')}</Button>

                                        <div className="pt-4">
                                            <h6 className='text-black fw-bold mb-3'>{lookup('common.volunteer_opportunity_for', 'Volunteer Opportunity For')}:</h6>
                                            {data.courtmandated && <div className="d-flex align-items-center mb-2"><FontAwesomeIcon icon={faGavel} className="me-2 text-muted" style={{width: '24px'}} /> Court mandated volunteers</div>}
                                            {data.schoolvol && <div className="d-flex align-items-center mb-2"><FontAwesomeIcon icon={faGraduationCap} className="me-2 text-muted" style={{width: '24px'}} /> High school students</div>}
                                            {data.vertualremote && <div className="d-flex align-items-center mb-2"><FontAwesomeIcon icon={faGlobe} className="me-2 text-muted" style={{width: '24px'}} /> Virtual/Remote volunteers</div>}
                                            {data.individuals && <div className="d-flex align-items-center mb-2"><Image src="/img/Opportinity/individual.png" width="24" className="me-2" /> {lookup('common.individuals', 'Individuals')}</div>}
                                            {data.group && <div className="d-flex align-items-center mb-2"><Image src="/img/Opportinity/group.png" width="24" className="me-2" /> {lookup('common.groups', 'Groups')}</div>}
                                        </div>

                                        <div className="pt-4">
                                            <h6 className='position-relative text-black fw-bold mb-3'>
                                                <span className='position-relative'>{lookup('public.our_sponsors', 'Our Sponsors')}
                                                    <sub className="sponsor-stars"><i>&nbsp;</i><i>&nbsp;</i><i>&nbsp;</i></sub>
                                                </span>
                                            </h6>
                                            {Array.isArray(data.sponsorlogo) && data.sponsorlogo.length > 0 ? (
                                                <div>{/* Simplified sidebar sponsor view */}</div>
                                            ) : (
                                                <p className='text-center py-3 text-muted'>{lookup('public.organization_doesnt_have_any_sponsors_yet', "Organization doesn't have any sponsors yet.")}</p>
                                            )}
                                            <Button variant='success' className='w-100 d-block mb-4'>{lookup('public.sponsor_now', 'Sponsor Now')}</Button>
                                        </div>

                                        {!data.org.custom_features?.disable_social_icons && (
                                            <div className="pt-4 border-top">
                                                <p className='text-black mb-1'>{lookup('public.share_opportunity', 'Share Opportunity')}</p>
                                                <Link to="#" className='fb-logo me-1'><span>&nbsp;</span></Link>
                                                <Link to="#" className='x-logo'><span>&nbsp;</span></Link>
                                            </div>
                                        )}

                                        {!data.org.disable_who_attend && (
                                            <div className="pt-4 mt-4 border-top">
                                                <p className='text-black fw-bold mb-3'>{lookup('public.whos_attending', "Who's attending?")}</p>
                                                {Array.isArray(data.shiftusers) && data.shiftusers.length > 0 ? data.shiftusers.map(user => (
                                                    <div className="d-flex align-items-center py-2" key={user.name}>
                                                        <Image src={user.pictureurl || DfaultUserLogo} alt="user logo" width={50} height={50} roundedCircle />
                                                        <p className='text-black mb-0 ms-3'>{user.name}</p>
                                                    </div>
                                                )) : <p className="text-muted">No attendees yet.</p>}
                                            </div>
                                        )}
                                    </Col>
                                </Row>
                            </div>
                            )}
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
};

export default OpportunityPage;
