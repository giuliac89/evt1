<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xpath-default-namespace="http://www.tei-c.org/ns/1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    xmlns:eg="http://www.tei-c.org/ns/Examples"
    xmlns:xd="http://www.pnp-software.com/XSLTdoc" 
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:ea="http://www.enlightenmentarchitectures.org"
    xmlns="http://www.w3.org/1999/xhtml"
    exclude-result-prefixes="#all">
        
        <xd:doc type="stylesheet">
            <xd:short>
                EN: This file has been prepared for you to add your personal XSLT templates
                IT: Questo file è stato predisposto per accogliere template personalizzati
            </xd:short>
        </xd:doc>
    <!-- In order to make it work properly you need to add mode="interp dipl #default" to each template -->
    
    <!-- Handle interesting elements -->
    <xsl:template match="tei:note | tei:bibl | tei:material | tei:label | tei:measure | tei:author | tei:pubPlace" mode="interp dipl #default" priority="9">
        <xsl:choose>
            <xsl:when test="self::tei:measure[@type='duodecimo'] | self::tei:measure[@type='octavo'] | self::tei:measure[@type='folio'] | self::tei:measure[@type='quarto']">
                <xsl:element name="span">
                    <xsl:attribute name="class"
                        select="concat('popup ', name())"/>
                    <xsl:attribute name="data-label">format</xsl:attribute>
                    <xsl:call-template name="dataAttributesFromAttributes"/>
                    <xsl:element name="span">
                        <xsl:attribute name="class">trigger</xsl:attribute>
                        <xsl:apply-templates mode="#current"/>
                    </xsl:element>
                    <xsl:element name="span">
                        <xsl:attribute name="class">tooltip</xsl:attribute>
                        <xsl:element name="span">
                            <xsl:attribute name="class">before</xsl:attribute>
                        </xsl:element>
                        <xsl:text> (</xsl:text>
                        <xsl:value-of select="@type"/>
                        <xsl:text>) </xsl:text>
                    </xsl:element>
                </xsl:element>
            </xsl:when>
            <xsl:when test="@type">
                <xsl:element name="span">
                    <xsl:attribute name="class"
                        select="concat('popup ', name())"/>
                    <xsl:call-template name="dataAttributesFromAttributes"/>
                    <xsl:element name="span">
                        <xsl:attribute name="class">trigger</xsl:attribute>
                        <xsl:apply-templates mode="#current"/>
                    </xsl:element>
                    <xsl:element name="span">
                        <xsl:attribute name="class">tooltip</xsl:attribute>
                        <xsl:element name="span">
                            <xsl:attribute name="class">before</xsl:attribute>
                        </xsl:element>
                        <xsl:text> (</xsl:text>
                        <xsl:value-of select="@type"/>
                        <xsl:text>) </xsl:text>
                    </xsl:element>
                </xsl:element>
            </xsl:when>
            <xsl:otherwise>
                <xsl:element name="span">
                    <xsl:attribute name="class" select="concat(name(), ' no-info')" />
                    <xsl:call-template name="dataAttributesFromAttributes"/>
                    <xsl:apply-templates mode="#current"/>
                </xsl:element>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <!-- Handle <ea:catnum> -->
    <xsl:template match="ea:catnum" mode="interp dipl #default" priority="9">
        <xsl:element name="span">
            <xsl:attribute name="class" select="substring-after(name(), ':')"/>
            <xsl:call-template name="dataAttributesFromAttributes"/>
            <xsl:apply-templates mode="#current"/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="tei:msContents" mode="interp dipl #default" priority="9">
        <div id="msContents">
            <div class="title_section">
                <span lang="def">MANUSCRIPT_CONTENTS</span>
            </div>
            <div class="table">
                <xsl:if test="tei:summary and tei:summary/normalize-space() != ''">
                    <div class="row">
                        <div class="left_col">
                            <span lang="def">MANUSCRIPT_CONTENT_SUMMARY</span><xsl:text>:</xsl:text>
                        </div>
                        <div class="right_col"><xsl:value-of select="tei:summary"/></div>
                    </div>
                </xsl:if>
                <xsl:if test="//tei:textLang and //tei:textLang/normalize-space() != ''">
                    <div class="row">
                        <div class="left_col">
                            <span lang="def">LANGUAGE</span><xsl:text>:</xsl:text>
                        </div>
                        <div class="right_col"><xsl:value-of select="//tei:textLang"/></div>
                    </div>  
                </xsl:if>
                <xsl:if test="//tei:msItem"><!--and tei:msItem/normalize-space() != ''">-->
                    <div class="row">
                        <div class="left_col">
                            <span lang="def">MANUSCRIPT_ITEMS</span><xsl:text>:</xsl:text>
                        </div>
                        <div class="right_col">
                            <xsl:for-each select="tei:msItem">
                                <div class="msItem">
                                    <xsl:if test="tei:locus and tei:title">
                                        <div class="block">
                                            <xsl:value-of select="tei:locus"/>
                                            <xsl:text>: </xsl:text>
                                            <xsl:value-of select="tei:title"/>	
                                        </div>
                                    </xsl:if>
                                    <xsl:if test="tei:incipit">
                                        <div class="block">
                                            <span lang="def">INCIPIT</span><xsl:text>: </xsl:text>
                                            <xsl:value-of select="tei:incipit"/>	
                                        </div>
                                    </xsl:if>
                                    <xsl:if test="tei:explicit">
                                        <div class="block">
                                            <span lang="def">EXPLICIT</span><xsl:text>: </xsl:text>
                                            <xsl:value-of select="tei:explicit"/>
                                        </div>
                                    </xsl:if>
                                    <xsl:if test="tei:colophon">
                                        <div class="block">
                                            <xsl:for-each select="tei:colophon//node()">
                                                <xsl:if test="self::tei:ptr[@type='external']">
                                                    <xsl:element name="a">
                                                        <xsl:attribute name="href" select="self::tei:ptr/@target" />
                                                        <xsl:attribute name="target">_blank</xsl:attribute>
                                                        <xsl:value-of select="self::tei:ptr/@target"/>
                                                    </xsl:element>
                                                </xsl:if>
                                                <xsl:value-of select="."/>
                                            </xsl:for-each>
                                        </div>
                                    </xsl:if>
                                </div>
                            </xsl:for-each>
                        </div>
                    </div>
                </xsl:if>
            </div>
        </div>
    </xsl:template>
    
</xsl:stylesheet>