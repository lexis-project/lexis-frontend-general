import React, { useEffect } from "react"
import { connect } from "react-redux"
import { actions } from "redux-router5"

import { ROUTE_PROJECT_LIST, ROUTE_ROOT, ROUTE_ORGANIZATION } from "../../routing/routes"
import { getRoutePath } from "../../routing/routing-selectors"
import { getUserRole } from "../../auth/auth-selectors"

export const AboutPageImpl = ({ navigateTo, prevRoute, userRole }) => {
    useEffect(() => {
        if (prevRoute === null && userRole === "dat_mgr") {
            navigateTo(ROUTE_ORGANIZATION)
        } else if (prevRoute === null && userRole !== "dat_mgr") {
            navigateTo(ROUTE_PROJECT_LIST)
        } else {
            navigateTo(ROUTE_ROOT)
        }
    }, [navigateTo, prevRoute])

    return (
        <>
            <div className="row">
                <div className="col">
                    <h1>Welcome to the LEXIS portal</h1>
                </div>
            </div>

            <div className="row">
                <div className="col-9">
                    <p>
                        The administrator of this portal warns that this is a
                        test environment. The administrator of the portal is
                        therefore not responsible for its perfect functionality
                        and warns that due to possible errors, the user cannot
                        be provided with legal certainty and protection of the
                        portal&apos;s services.
                    </p>
                    <div className="card">
                        <div className="card-header"></div>
                        <div className="card-body">
                            <h2>
                                About Lexis Project - HPC solutions and
                                infrastructure
                            </h2>
                            <p>
                                The LEXIS project will build an advanced
                                engineering platform at the confluence of HPC,
                                Cloud and Big Data which will leverage
                                large-scale geographically-distributed resources
                                from existing HPC infrastructure, employ Big
                                Data analytics solutions and augment them with
                                Cloud services.
                            </p>
                            <p>
                                Driven by the requirements of the pilots, the
                                LEXIS platform will build on best of breed data
                                management solutions and advanced distributed
                                orchestration solutions augmenting them with
                                new, efficient hardware capabilities in the form
                                of Data Nodes and federation, usage monitoring
                                and accounting/billing supports to realize an
                                innovative solution.
                            </p>
                            <p>
                                LEXIS project focuses on the convergence of
                                large-scale HPC and cloud-run data analytics
                                workflows. The emphasis of LEXIS will be on how
                                HPC and cloud systems interact; how they can
                                share data; and methods to compose workflows of
                                tasks running on both cloud and HPC systems.
                                LEXIS will develop infrastructure to enable
                                these workflows and demonstrate its abilities
                                through three large-scale socio-economic pilots,
                                targeting aeronautics, weather climate, and
                                catastrophe alert systems.
                            </p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-header"></div>
                        <div className="card-body">
                            <h3>LEXIS OVERALL OBJECTIVES</h3>
                            <h4>O1.1) Foundation</h4>
                            <p>
                                Build a distributed HPC infrastructure for Big
                                data and HPC convergence. The aim will on build
                                an advanced architecture for big data analytics
                                and HPC applications leveraging modern
                                technologies from HPC, Big data and Cloud
                                computing.
                            </p>
                            <h4>O1.2) Innovation</h4>
                            <p>
                                Validation from three large scale pilots. The
                                aim will on improving performances in term of
                                computational time and data management. The aim
                                will on demonstrate benefits by creating an
                                ecosystem for industrial applications context.
                            </p>
                            <h4>O1.3) Extension</h4>
                            <p>
                                LEXIS infrastructure, platform ad services will
                                be extended by Open call for external
                                stakeholders mainly from existing pilots
                                test-beds in E-science and industrial sectors:
                                Aeronautics, Weather and Climate, and Earthquake
                                and Tsunami.
                            </p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-header"></div>
                        <div className="card-body">
                            <h3>LEXIS TEST-BED-SPECIFIC OBJECTIVES</h3>
                            <h4>O2.1) Aeronautics</h4>
                            <p>
                                The Aeronautics Large-scale Pilot lead by Avio
                                Aero company in LEXIS is aimed to boost and
                                promote a step change in the numerical
                                investigations of complex fluid-dynamic
                                behaviour of critical aeronautical engines’
                                components, allowing to improve their
                                engineering design quality so as to optimize
                                engine performance (specific fuel consumption
                                and emissions) and to make lighter and greener
                                aircraft.
                            </p>
                            <p>
                                Framed in this challenging context, the
                                industrial applicability of LEXIS platform will
                                be investigated both to reduce the running time
                                of CPU-intensive and time-consuming engineering
                                jobs and to enhance data handling and
                                post-processing operations of the large dataset
                                collected as jobs’ results.
                            </p>
                            <h4>O2.2) Weather and climate.</h4>
                            <p>
                                Within the context of Copernicus Services, the
                                Weather & Climate pilot will increase the
                                timeliness and quality of prediction and
                                analyses.
                            </p>
                            <p>
                                Simplify the access to such services from the
                                cloud, in order to expand the downstream
                                markets: emergency management, sustainable food
                                and energy production, air quality.
                            </p>
                            <h4>O2.3) Earthquake and tsunami</h4>
                            <p>
                                Earthquake and tsunami. Provide near real-time
                                earthquake and tsunami damage/loss assessments
                                and estimate of the tsunami inundation through
                                simulations based on earthquake parameters,
                                ensuring the delivery of expected consequences
                                in time for fast response planning by emergency
                                dispatchers.
                            </p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-header"></div>
                        <div className="card-body">
                            <h3>LEXIS TECHNOLOGY-SPECIFIC OBJECTIVES</h3>
                            <h4>O3.1) HPC-as-a-Service</h4>
                            <p>
                                Providing a ready-to-be-used HPC infrastructure
                                that offers HPC-as-a-Service capabilities
                                without incurring in performance/efficiency
                                slowdowns.
                            </p>
                            <h4>O3.2) Heterogeneous data storage</h4>
                            <p>
                                Implement a heterogeneous data storage
                                management system providing simplified access to
                                huge amounts of data.
                            </p>
                            <h4>O3.3) Speed</h4>
                            <p>
                                Speed up CPU intensive and data/memory intensive
                                algorithms also to support real time decision
                                making.
                            </p>
                            <h4>
                                O3.4) Optimized data management and analytics
                            </h4>
                            <p>
                                Optimize data management operations and
                                analytics algorithms that exploit the underlying
                                infrastructures at their best to eventually
                                extract outputs from data that help stakeholders
                                improve their businesses.
                            </p>
                            <h4>O3.5) Simple and secure HPDA service</h4>
                            <p>
                                Provide simple and secure HPDA service
                                provisioning, through cloud technologies, for
                                the pilot test-beds, accessible also for other
                                users.
                            </p>
                            <h4>O3.6) Interoperability</h4>
                            <p>
                                Guarantee interoperability with external data
                                sources and seamless integration with external
                                systems.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    path: getRoutePath(state),
    prevRoute: getRoutePath(state),
    userRole: getUserRole(state)
})

const mapDispatchToProps = {
    navigateTo: actions.navigateTo,
}

export const AboutPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(AboutPageImpl)
